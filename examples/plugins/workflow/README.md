# Workflow Plugin

Complete workflow automation system for ObjectOS.

## Features

- ✅ Visual workflow designer
- ✅ Auto-trigger workflows on create/update
- ✅ Approval steps with user assignments
- ✅ Notifications and webhooks
- ✅ Field updates
- ✅ Workflow status tracking
- ✅ Background workflow execution

## Installation

```bash
npm install @example/workflow-plugin
```

## Usage

```typescript
import { createFramework } from '@objectos/web-framework';
import WorkflowPlugin from '@example/workflow-plugin';

const framework = createFramework({
  plugins: [
    new WorkflowPlugin()
  ]
});
```

## What This Plugin Provides

### Metadata

**New Objects:**
- `workflow` - Workflow definitions
- `workflow_instance` - Running workflow instances

**New Fields:**
- Adds `workflow_status` field to all objects

### Backend

**Hooks:**
- `afterInsert` - Auto-start workflows on record creation
- `afterUpdate` - Auto-start workflows on record update

**Actions:**
- `workflow.start` - Manually start a workflow
- `approval.approve` - Approve a workflow step

**APIs:**
- `POST /api/workflow/execute` - Execute a workflow
- `GET /api/workflow/status/:instanceId` - Get workflow status
- `GET /api/workflow/list/:objectName` - List active workflows

**Services:**
- `WorkflowEngine` - Background service that processes workflows

### Frontend

**Components:**
- `workflow-designer` - Visual workflow builder
- `workflow-board` - Kanban board for tracking workflows

## Creating a Workflow

```typescript
// 1. Create workflow definition
const workflow = await kernel.insert('workflow', {
  name: 'Approval Workflow',
  description: 'Auto-approve high-value deals',
  trigger_type: 'On Create',
  trigger_object: 'opportunities',
  status: 'Active',
  steps: [
    {
      type: 'approval',
      name: 'Manager Approval',
      approver_id: 'manager_user_id'
    },
    {
      type: 'notification',
      name: 'Notify Sales Team',
      recipient_id: 'sales_team_id'
    },
    {
      type: 'update_field',
      name: 'Mark as Approved',
      field_name: 'approval_status',
      field_value: 'Approved'
    }
  ]
});

// 2. Workflow will auto-start when opportunity is created
const opportunity = await kernel.insert('opportunities', {
  name: 'Big Deal',
  amount: 100000
});

// 3. Or manually start workflow
await kernel.action('workflow.start', {
  workflow_id: workflow.id
}, {
  recordId: opportunity.id,
  objectName: 'opportunities'
});
```

## Approving a Workflow Step

```typescript
// Find pending workflows
const pending = await kernel.find('workflow_instance', {
  filters: [
    ['status', '=', 'Pending']
  ]
});

// Approve
await kernel.action('approval.approve', {
  instance_id: pending[0].id,
  comments: 'Looks good!'
});
```

## API Usage

```javascript
// Execute workflow via API
fetch('/api/workflow/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflow_id: 'workflow-123',
    record_id: 'record-456',
    object_name: 'opportunities'
  })
});

// Check status
fetch('/api/workflow/status/instance-789')
  .then(res => res.json())
  .then(data => console.log(data));
```

## UI Components

```tsx
import { WorkflowDesigner, WorkflowBoard } from '@example/workflow-plugin';

// Workflow designer
<WorkflowDesigner
  onSave={(workflow) => {
    kernel.insert('workflow', workflow);
  }}
/>

// Workflow board
<WorkflowBoard objectName="opportunities" />
```

## License

MIT
