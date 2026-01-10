# Security Guide

Security in ObjectOS is handled through Permissions and Plugins.

## Authentication

Use `@objectos/plugin-auth` for handling user sessions.

## Authorization

Permissions are defined in object definitions or via permission sets.

```typescript
// Example of permission check
if (!ctx.hasPermission('project', 'create')) {
  throw new PermissionDeniedError();
}
```
