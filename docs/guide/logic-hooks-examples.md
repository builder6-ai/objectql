# Logic Hooks Examples

## Auto-Populate Current User

```typescript
kernel.on('beforeCreate', async (ctx) => {
  if (ctx.objectName === 'task' && ctx.user) {
    ctx.data.created_by = ctx.user.id;
  }
});
```

## Validation

```typescript
kernel.on('beforeUpdate', async (ctx) => {
  if (ctx.objectName === 'project' && ctx.data.budget < 0) {
    throw new ValidationError('Budget cannot be negative');
  }
});
```
