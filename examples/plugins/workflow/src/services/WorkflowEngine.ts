/**
 * Workflow Engine Service
 * 
 * Executes workflow instances step by step
 */

import type { PluginContext } from '@objectos/web-framework';

export class WorkflowEngine {
  private context: PluginContext;
  private running = false;
  private processInterval: NodeJS.Timeout | null = null;
  
  constructor(context: PluginContext) {
    this.context = context;
  }
  
  async start() {
    this.running = true;
    
    // Process pending workflows every 10 seconds
    this.processInterval = setInterval(() => {
      this.processPendingWorkflows();
    }, 10000);
    
    console.log('[WorkflowEngine] Started');
  }
  
  async stop() {
    this.running = false;
    
    if (this.processInterval) {
      clearInterval(this.processInterval);
    }
    
    console.log('[WorkflowEngine] Stopped');
  }
  
  async execute(instanceId: string) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    const workflow = await this.context.kernel.findOne('workflow', instance.workflow);
    
    const steps = workflow.steps || [];
    const currentStep = steps[instance.current_step];
    
    if (!currentStep) {
      // No more steps, complete workflow
      await this.completeWorkflow(instanceId);
      return;
    }
    
    // Execute current step
    await this.executeStep(instanceId, currentStep);
  }
  
  private async executeStep(instanceId: string, step: any) {
    console.log(`[WorkflowEngine] Executing step:`, step);
    
    switch (step.type) {
      case 'approval':
        await this.handleApprovalStep(instanceId, step);
        break;
        
      case 'notification':
        await this.handleNotificationStep(instanceId, step);
        break;
        
      case 'update_field':
        await this.handleUpdateFieldStep(instanceId, step);
        break;
        
      case 'webhook':
        await this.handleWebhookStep(instanceId, step);
        break;
        
      default:
        // Unknown step type, skip
        await this.moveToNextStep(instanceId);
    }
  }
  
  private async handleApprovalStep(instanceId: string, step: any) {
    // Create approval request
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    const approvalRequest = await this.context.kernel.insert('approval_request', {
      workflow_instance: instanceId,
      approver: step.approver_id,
      step_name: step.name,
      status: 'Pending',
      created_at: new Date()
    });
    
    // Update instance with pending approval
    await this.context.kernel.update('workflow_instance', instanceId, {
      status: 'Pending',
      variables: {
        ...instance.variables,
        pending_approval: approvalRequest.id
      }
    });
    
    console.log(`[WorkflowEngine] Waiting for approval: ${approvalRequest.id}`);
  }
  
  private async handleNotificationStep(instanceId: string, step: any) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    console.log(`[WorkflowEngine] Sending notification to: ${step.recipient_id}`);
    
    // Send notification (placeholder)
    // In real implementation, integrate with email/SMS service
    
    await this.moveToNextStep(instanceId);
  }
  
  private async handleUpdateFieldStep(instanceId: string, step: any) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    // Update field on related record
    await this.context.kernel.update(instance.record_type, instance.record_id, {
      [step.field_name]: step.field_value
    });
    
    console.log(`[WorkflowEngine] Updated field: ${step.field_name} = ${step.field_value}`);
    
    await this.moveToNextStep(instanceId);
  }
  
  private async handleWebhookStep(instanceId: string, step: any) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    console.log(`[WorkflowEngine] Calling webhook: ${step.url}`);
    
    // Call external webhook (placeholder)
    // In real implementation, make HTTP request
    
    await this.moveToNextStep(instanceId);
  }
  
  async approveStep(instanceId: string, userId: string, comments?: string) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    // Find pending approval
    const approvalId = instance.variables?.pending_approval;
    if (!approvalId) {
      throw new Error('No pending approval for this workflow');
    }
    
    // Update approval status
    await this.context.kernel.update('approval_request', approvalId, {
      status: 'Approved',
      decided_by: userId,
      decided_at: new Date(),
      comments
    });
    
    console.log(`[WorkflowEngine] Approval granted by: ${userId}`);
    
    // Move to next step
    await this.moveToNextStep(instanceId);
  }
  
  private async moveToNextStep(instanceId: string) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    const workflow = await this.context.kernel.findOne('workflow', instance.workflow);
    
    const nextStep = instance.current_step + 1;
    const steps = workflow.steps || [];
    
    if (nextStep >= steps.length) {
      // No more steps
      await this.completeWorkflow(instanceId);
    } else {
      // Move to next step
      await this.context.kernel.update('workflow_instance', instanceId, {
        current_step: nextStep,
        status: 'InProgress'
      });
      
      // Execute next step
      await this.execute(instanceId);
    }
  }
  
  private async completeWorkflow(instanceId: string) {
    const instance = await this.context.kernel.findOne('workflow_instance', instanceId);
    
    await this.context.kernel.update('workflow_instance', instanceId, {
      status: 'Completed',
      completed_at: new Date()
    });
    
    // Update original record
    await this.context.kernel.update(instance.record_type, instance.record_id, {
      workflow_status: 'Completed'
    });
    
    console.log(`[WorkflowEngine] Workflow completed: ${instanceId}`);
  }
  
  private async processPendingWorkflows() {
    if (!this.running) return;
    
    // Find workflows in InProgress state
    const instances = await this.context.kernel.find('workflow_instance', {
      filters: [['status', '=', 'InProgress']],
      limit: 10
    });
    
    for (const instance of instances) {
      try {
        await this.execute(instance.id);
      } catch (error) {
        console.error(`[WorkflowEngine] Error executing workflow ${instance.id}:`, error);
        
        // Mark as failed
        await this.context.kernel.update('workflow_instance', instance.id, {
          status: 'Failed'
        });
      }
    }
  }
}
