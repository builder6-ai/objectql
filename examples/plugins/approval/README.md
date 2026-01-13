# Approval Plugin

Simple approval system for any ObjectOS object.

## Installation

```bash
npm install @example/approval-plugin
```

## Usage

```typescript
import { createFramework } from '@objectos/web-framework';
import ApprovalPlugin from '@example/approval-plugin';

const framework = createFramework({
  plugins: [new ApprovalPlugin()]
});
```

## What This Plugin Provides

### New Objects
- `approval_request` - Tracks approval requests

### New Fields (added to ALL objects)
- `approval_status` - Current approval status

### Actions
- `approval.request` - Request approval for a record

## Example

```typescript
// Request approval
await kernel.action('approval.request', {
  approver_id: 'user-123'
}, {
  recordId: 'record-456',
  objectName: 'opportunities'
});

// Check status
const record = await kernel.findOne('opportunities', 'record-456');
console.log(record.approval_status); // 'Pending'
```

## License

MIT
