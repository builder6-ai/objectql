/**
 * Workflow Board Component
 * 
 * Kanban-style view of workflow instances
 */

import React, { useEffect, useState } from 'react';

interface WorkflowBoardProps {
  objectName?: string;
}

export function WorkflowBoard({ objectName }: WorkflowBoardProps) {
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadInstances();
  }, [objectName]);
  
  const loadInstances = async () => {
    setLoading(true);
    
    try {
      // Fetch workflow instances
      const response = await fetch('/api/data/workflow_instance');
      const data = await response.json();
      setInstances(data);
    } catch (error) {
      console.error('Failed to load workflow instances:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const groupedInstances = {
    Pending: instances.filter(i => i.status === 'Pending'),
    InProgress: instances.filter(i => i.status === 'InProgress'),
    Completed: instances.filter(i => i.status === 'Completed'),
    Failed: instances.filter(i => i.status === 'Failed')
  };
  
  return (
    <div className="workflow-board p-6">
      <div className="header mb-6">
        <h2 className="text-2xl font-bold">Workflow Board</h2>
        <p className="text-gray-600 mt-1">Track all workflow instances</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading workflows...</p>
        </div>
      ) : (
        <div className="board grid grid-cols-4 gap-4">
          {Object.entries(groupedInstances).map(([status, items]) => (
            <div key={status} className="column">
              <div className="column-header mb-3">
                <h3 className="font-semibold text-sm uppercase text-gray-600">
                  {status}
                  <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {items.length}
                  </span>
                </h3>
              </div>
              
              <div className="column-content space-y-3">
                {items.map((instance) => (
                  <div
                    key={instance.id}
                    className="card p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="card-header mb-2">
                      <h4 className="font-medium text-sm">{instance.workflow?.name || 'Workflow'}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {instance.record_type} • {instance.record_id}
                      </p>
                    </div>
                    
                    <div className="card-body">
                      <div className="text-xs text-gray-600">
                        <div className="flex justify-between py-1">
                          <span>Step:</span>
                          <span className="font-medium">{instance.current_step + 1}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Started:</span>
                          <span className="font-medium">
                            {new Date(instance.started_at).toLocaleDateString()}
                          </span>
                        </div>
                        {instance.completed_at && (
                          <div className="flex justify-between py-1">
                            <span>Completed:</span>
                            <span className="font-medium">
                              {new Date(instance.completed_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-footer mt-3 pt-3 border-t">
                      <button className="text-xs text-blue-600 hover:underline">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No workflows
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
