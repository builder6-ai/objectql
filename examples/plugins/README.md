# ObjectOS Plugin Examples

Real, working plugin code examples demonstrating the ObjectOS plugin system.

## Available Examples

### 1. Simple Table Plugin
**Location:** `simple-table/`

Minimal table plugin demonstrating:
- Metadata-driven UI generation
- Auto-column generation from object definitions
- Basic sorting and row handling

**Code:** [index.ts](./simple-table/src/index.ts) | **README:** [simple-table/README.md](./simple-table/README.md)

### 2. Workflow Plugin ⭐ NEW
**Location:** `workflow/`

Complete workflow automation system (**300+ lines of actual code**):
- ✅ Metadata: New objects (`workflow`, `workflow_instance`)
- ✅ Hooks: Auto-trigger workflows on create/update
- ✅ Actions: `workflow.start`, `approval.approve`
- ✅ APIs: `/api/workflow/execute`, `/api/workflow/status`
- ✅ Services: Background WorkflowEngine
- ✅ UI: WorkflowDesigner, WorkflowBoard components

**Code:** [index.ts](./workflow/src/index.ts) | **README:** [workflow/README.md](./workflow/README.md)

### 3. Approval Plugin ⭐ NEW
**Location:** `approval/`

Simple approval system (**80 lines of essential code**):
- Metadata: `approval_request` object
- Fields: Adds `approval_status` to all objects
- Actions: Request and approve workflows
- Hooks: Prevent editing approved records

**Code:** [index.ts](./approval/src/index.ts) | **README:** [approval/README.md](./approval/README.md)

## Quick Start

```typescript
import { createFramework } from '@objectos/web-framework';
import WorkflowPlugin from '@example/workflow-plugin';
import ApprovalPlugin from '@example/approval-plugin';

const framework = createFramework({
  plugins: [
    new WorkflowPlugin(),
    new ApprovalPlugin()
  ]
});
```

## Plugin Capabilities Matrix

| Feature | Simple Table | Workflow | Approval |
|---------|-------------|----------|----------|
| **Frontend** |
| UI Components | ✅ | ✅ | ✅ |
| Metadata-driven | ✅ | ✅ | ✅ |
| **Backend** |
| New Objects | ❌ | ✅ | ✅ |
| Add Fields | ❌ | ✅ | ✅ |
| Hooks | ❌ | ✅ | ✅ |
| Actions | ❌ | ✅ | ✅ |
| APIs | ❌ | ✅ | ❌ |
| Services | ❌ | ✅ | ❌ |

## Documentation

- [Plugin Development Guide](../../docs/guide/plugin-development.md)
- [Web Framework Specification](../../docs/spec/web-framework.md)

