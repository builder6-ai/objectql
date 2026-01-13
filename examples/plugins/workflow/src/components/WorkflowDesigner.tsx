/**
 * Workflow Designer Component
 * 
 * Visual workflow builder UI
 */

import React, { useState } from 'react';

interface WorkflowDesignerProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
}

export function WorkflowDesigner({ workflowId, onSave }: WorkflowDesignerProps) {
  const [workflow, setWorkflow] = useState({
    name: '',
    description: '',
    trigger_type: 'Manual',
    trigger_object: '',
    steps: []
  });
  
  const [steps, setSteps] = useState<any[]>([]);
  
  const addStep = (type: string) => {
    const newStep = {
      id: Date.now().toString(),
      type,
      name: `${type} Step`,
      config: {}
    };
    
    setSteps([...steps, newStep]);
  };
  
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    const workflowData = {
      ...workflow,
      steps
    };
    
    onSave?.(workflowData);
  };
  
  return (
    <div className="workflow-designer p-6">
      <div className="header mb-6">
        <h2 className="text-2xl font-bold mb-4">Workflow Designer</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Workflow Name</label>
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter workflow name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Trigger Type</label>
            <select
              value={workflow.trigger_type}
              onChange={(e) => setWorkflow({ ...workflow, trigger_type: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Manual">Manual</option>
              <option value="On Create">On Create</option>
              <option value="On Update">On Update</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={workflow.description}
            onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            placeholder="Enter description"
          />
        </div>
      </div>
      
      <div className="steps mb-6">
        <h3 className="text-lg font-semibold mb-3">Workflow Steps</h3>
        
        <div className="step-toolbox mb-4 flex gap-2">
          <button
            onClick={() => addStep('approval')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Approval
          </button>
          <button
            onClick={() => addStep('notification')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Notification
          </button>
          <button
            onClick={() => addStep('update_field')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            + Update Field
          </button>
          <button
            onClick={() => addStep('webhook')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            + Webhook
          </button>
        </div>
        
        <div className="steps-list space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="step-card p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {step.type}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[index].name = e.target.value;
                      setSteps(updated);
                    }}
                    className="w-full px-3 py-2 border rounded mb-2"
                    placeholder="Step name"
                  />
                  
                  {step.type === 'approval' && (
                    <div className="mt-2">
                      <label className="block text-sm mb-1">Approver</label>
                      <input
                        type="text"
                        placeholder="User ID"
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  )}
                  
                  {step.type === 'notification' && (
                    <div className="mt-2">
                      <label className="block text-sm mb-1">Recipient</label>
                      <input
                        type="text"
                        placeholder="User ID or email"
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  )}
                  
                  {step.type === 'update_field' && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm mb-1">Field Name</label>
                        <input
                          type="text"
                          placeholder="field_name"
                          className="w-full px-3 py-2 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Value</label>
                        <input
                          type="text"
                          placeholder="value"
                          className="w-full px-3 py-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  )}
                  
                  {step.type === 'webhook' && (
                    <div className="mt-2">
                      <label className="block text-sm mb-1">Webhook URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeStep(index)}
                  className="ml-3 px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No steps added yet. Click the buttons above to add steps.
            </div>
          )}
        </div>
      </div>
      
      <div className="actions flex justify-end gap-3">
        <button className="px-6 py-2 border rounded hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Workflow
        </button>
      </div>
    </div>
  );
}
