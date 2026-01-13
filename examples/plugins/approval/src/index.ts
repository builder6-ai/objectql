/**
 * Simple Approval Plugin
 * 
 * Adds approval functionality to any object
 */

import type { IObjectOSPlugin, PluginContext } from '@objectos/web-framework';

export class ApprovalPlugin implements IObjectOSPlugin {
  name = '@example/approval-plugin';
  version = '1.0.0';
  
  metadata = {
    displayName: 'Simple Approvals',
    description: 'Add approval workflows to any object',
    author: 'ObjectOS Examples',
    license: 'MIT',
    pricing: { type: 'free' }
  };
  
  capabilities = {
    metadata: {
      objects: ['approval_request'],
      fields: ['approval_status'],
      actions: ['request_approval', 'approve']
    },
    backend: {
      actions: ['approval.request', 'approval.approve'],
      apis: ['/api/approval/pending']
    }
  };
  
  async initialize(context: PluginContext) {
    // Register metadata
    context.metadata.registerObject({
      name: 'approval_request',
      label: 'Approval Request',
      fields: {
        record_id: { type: 'text', label: 'Record ID' },
        record_type: { type: 'text', label: 'Object' },
        approver: { type: 'lookup', label: 'Approver', reference_to: 'users' },
        status: { type: 'select', label: 'Status', options: ['Pending', 'Approved', 'Rejected'] }
      }
    });
    
    context.metadata.addField('*', {
      name: 'approval_status',
      type: 'select',
      label: 'Approval Status',
      options: ['Not Submitted', 'Pending', 'Approved']
    });
    
    // Register actions
    context.actions.register({
      name: 'approval.request',
      label: 'Request Approval',
      parameters: {
        approver_id: { type: 'lookup', reference_to: 'users', required: true }
      },
      execute: async (params, actionContext) => {
        await context.kernel.insert('approval_request', {
          record_id: actionContext.recordId,
          record_type: actionContext.objectName,
          approver: params.approver_id,
          status: 'Pending'
        });
        
        await context.kernel.update(actionContext.objectName, actionContext.recordId, {
          approval_status: 'Pending'
        });
        
        return { success: true };
      }
    });
  }
}

export default ApprovalPlugin;
