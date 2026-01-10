# Writing Hooks

Hooks allow you to intercept and modify standard operations.

## Hook Events

- `beforeFind`, `afterFind`
- `beforeCreate`, `afterCreate`
- `beforeUpdate`, `afterUpdate`
- `beforeDelete`, `afterDelete`

## Registration

```typescript
kernel.on('beforeCreate', async (ctx) => {
  console.log('Creating object:', ctx.objectName);
});
```
