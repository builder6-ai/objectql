# SDK Reference

The Kernel SDK provides methods to interact with your data programmatically.

## `kernel.find(objectName, options)`

Retrieves records matching the query options.

```typescript
const projects = await kernel.find('project', {
  filters: [['status', '=', 'active']]
});
```

## `kernel.create(objectName, data)`

Creates a new record.

```typescript
await kernel.create('project', { name: 'New API' });
```
