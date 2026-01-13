/**
 * Workflow Plugin - Complete implementation
 * 
 * This plugin demonstrates:
 * - Metadata registration (new objects)
 * - Server-side hooks
 * - Custom actions
 * - API endpoints
 * - Background services
 * - UI components
 */

import type { IObjectOSPlugin, PluginContext, PluginMetadata, PluginCapabilities } from '@objectos/web-framework';
import { WorkflowEngine } from './services/WorkflowEngine';
import { WorkflowDesigner } from './components/WorkflowDesigner';
import { WorkflowBoard } from './components/WorkflowBoard';

export class WorkflowPlugin implements IObjectOSPlugin {
  name = '@example/workflow-plugin';
  version = '1.0.0';
  category = 'feature';
  
  metadata: PluginMetadata = {
    displayName: 'Workflow Engine',
    description: 'Complete workflow and automation system',
    author: 'ObjectOS Examples',
    category: 'integration',
    license: 'MIT',
    pricing: { type: 'free' },
    tags: ['workflow', 'automation', 'approval']
  };
  
  capabilities: PluginCapabilities = {
    provides: {
      components: ['workflow-designer', 'workflow-board'],
      services: ['workflow-engine']
    },
    metadata: {
      objects: ['workflow', 'workflow_instance'],
      fields: ['workflow_status'],
      actions: ['start_workflow', 'approve']
    },
    backend: {
      hooks: ['workflow:beforeStart'],
      actions: ['workflow.start', 'approval.approve'],
      apis: ['/api/workflow/execute'],
      services: ['WorkflowEngine']
    }
  };
  
  private engine!: WorkflowEngine;
  
  async initialize(context: PluginContext) {
    // 1. Register metadata
    this.registerMetadata(context);
    
    // 2. Register hooks
    this.registerHooks(context);
    
    // 3. Register actions
    this.registerActions(context);
    
    // 4. Register APIs
    this.registerAPIs(context);
    
    // 5. Register UI components
    this.registerComponents(context);
    
    // 6. Start workflow engine
    this.engine = new WorkflowEngine(context);
    await this.engine.start();
  }
  
  private registerMetadata(context: PluginContext) {
    // Register Workflow object
    context.metadata.registerObject({
      name: 'workflow',
      label: 'Workflow',
      icon: 'workflow',
      fields: {
        name: {
          type: 'text',
          label: 'Workflow Name',
          required: true
        },
        description: {
          type: 'textarea',
          label: 'Description'
        },
        trigger_type: {
          type: 'select',
          label: 'Trigger Type',
          options: ['Manual', 'On Create', 'On Update', 'Scheduled'],
          default: 'Manual'
        },
        trigger_object: {
          type: 'text',
          label: 'Target Object',
          helpText: 'Which object triggers this workflow'
        },
        steps: {
          type: 'json',
          label: 'Workflow Steps',
          default: []
        },
        status: {
          type: 'select',
          label: 'Status',
          options: ['Draft', 'Active', 'Archived'],
          default: 'Draft'
        }
      }
    });
    
    // Register WorkflowInstance object
    context.metadata.registerObject({
      name: 'workflow_instance',
      label: 'Workflow Instance',
      fields: {
        workflow: {
          type: 'lookup',
          label: 'Workflow',
          reference_to: 'workflow',
          required: true
        },
        record_id: {
          type: 'text',
          label: 'Related Record ID'
        },
        record_type: {
          type: 'text',
          label: 'Related Object'
        },
        status: {
          type: 'select',
          label: 'Status',
          options: ['Pending', 'InProgress', 'Completed', 'Cancelled', 'Failed'],
          default: 'Pending'
        },
        current_step: {
          type: 'number',
          label: 'Current Step',
          default: 0
        },
        variables: {
          type: 'json',
          label: 'Variables',
          default: {}
        },
        started_at: {
          type: 'datetime',
          label: 'Started At'
        },
        completed_at: {
          type: 'datetime',
          label: 'Completed At'
        }
      }
    });
    
    // Add workflow_status field to all objects
    context.metadata.addField('*', {
      name: 'workflow_status',
      type: 'select',
      label: 'Workflow Status',
      options: ['Not Started', 'In Progress', 'Completed', 'Failed'],
      default: 'Not Started',
      hidden: true
    });
  }
  
  private registerHooks(context: PluginContext) {
    // Hook: Auto-start workflow when record is created
    context.hooks.register('afterInsert', async (hookContext) => {
      const { objectName, record } = hookContext;
      
      // Find workflows that should trigger on create
      const workflows = await context.kernel.find('workflow', {
        filters: [
          ['trigger_type', '=', 'On Create'],
          ['trigger_object', '=', objectName],
          ['status', '=', 'Active']
        ]
      });
      
      for (const workflow of workflows) {
        await this.startWorkflow(context, workflow.id, record.id, objectName);
      }
    });
    
    // Hook: Auto-start workflow when record is updated
    context.hooks.register('afterUpdate', async (hookContext) => {
      const { objectName, record } = hookContext;
      
      const workflows = await context.kernel.find('workflow', {
        filters: [
          ['trigger_type', '=', 'On Update'],
          ['trigger_object', '=', objectName],
          ['status', '=', 'Active']
        ]
      });
      
      for (const workflow of workflows) {
        await this.startWorkflow(context, workflow.id, record.id, objectName);
      }
    });
  }
  
  private registerActions(context: PluginContext) {
    // Action: Start workflow
    context.actions.register({
      name: 'workflow.start',
      label: 'Start Workflow',
      description: 'Manually start a workflow for this record',
      parameters: {
        workflow_id: {
          type: 'lookup',
          reference_to: 'workflow',
          required: true,
          label: 'Select Workflow'
        }
      },
      execute: async (params, actionContext) => {
        const instance = await this.startWorkflow(
          context,
          params.workflow_id,
          actionContext.recordId,
          actionContext.objectName
        );
        
        return {
          success: true,
          instance_id: instance.id,
          message: `Workflow started successfully`
        };
      }
    });
    
    // Action: Approve current step
    context.actions.register({
      name: 'approval.approve',
      label: 'Approve',
      description: 'Approve current workflow step',
      parameters: {
        instance_id: {
          type: 'text',
          required: true,
          label: 'Workflow Instance ID'
        },
        comments: {
          type: 'textarea',
          label: 'Comments'
        }
      },
      execute: async (params, actionContext) => {
        await this.engine.approveStep(params.instance_id, actionContext.user.id, params.comments);
        
        return {
          success: true,
          message: 'Approved successfully'
        };
      }
    });
  }
  
  private registerAPIs(context: PluginContext) {
    // API: Execute workflow
    context.routes.register('POST', '/api/workflow/execute', async (req, res) => {
      const { workflow_id, record_id, object_name } = req.body;
      
      try {
        const instance = await this.startWorkflow(context, workflow_id, record_id, object_name);
        res.json({ success: true, instance });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });
    
    // API: Get workflow status
    context.routes.register('GET', '/api/workflow/status/:instanceId', async (req, res) => {
      const instance = await context.kernel.findOne('workflow_instance', req.params.instanceId);
      
      res.json({
        status: instance.status,
        current_step: instance.current_step,
        started_at: instance.started_at,
        completed_at: instance.completed_at
      });
    });
    
    // API: Get active workflows for an object
    context.routes.register('GET', '/api/workflow/list/:objectName', async (req, res) => {
      const workflows = await context.kernel.find('workflow', {
        filters: [
          ['trigger_object', '=', req.params.objectName],
          ['status', '=', 'Active']
        ]
      });
      
      res.json({ workflows });
    });
  }
  
  private registerComponents(context: PluginContext) {
    context.components.register('workflow-designer', WorkflowDesigner);
    context.components.register('workflow-board', WorkflowBoard);
  }
  
  private async startWorkflow(
    context: PluginContext,
    workflowId: string,
    recordId: string,
    objectName: string
  ) {
    const workflow = await context.kernel.findOne('workflow', workflowId);
    
    const instance = await context.kernel.insert('workflow_instance', {
      workflow: workflowId,
      record_id: recordId,
      record_type: objectName,
      status: 'InProgress',
      current_step: 0,
      variables: {},
      started_at: new Date()
    });
    
    // Update original record
    await context.kernel.update(objectName, recordId, {
      workflow_status: 'In Progress'
    });
    
    // Start executing workflow
    await this.engine.execute(instance.id);
    
    return instance;
  }
  
  async destroy() {
    await this.engine.stop();
  }
}

export default WorkflowPlugin;
