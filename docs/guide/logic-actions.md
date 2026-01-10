# Custom Actions

Actions are custom business logic endpoints.

## Defining an Action

Actions are often defined in YAML files (`*.action.yml`) or registered programmatically.

```typescript
kernel.registerAction('project.archive', async (ctx) => {
  const { id } = ctx.params;
  // Custom logic to archive project
});
```
