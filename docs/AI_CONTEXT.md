# ObjectQL AI Developer Context

This document is optimized for AI coding assistants (GitHub Copilot, Cursor, etc.) to understand the ObjectQL framework context, constraints, and valid syntax.

## 1. Project Structure
ObjectQL projects follow a modular structure.
*   **Definition Files**: `*.object.yml` defines the database schema and UI metadata.
*   **Logic Files**: `*.hook.ts` (triggers) and `*.action.ts` (custom API methods).
*   **Entry Point**: `index.ts` usually exports the module definition.

## 2. Metadata Schema (`.object.yml`)
### 2.1 File Format
```yaml
name: project_task      # Unique API Name (table name)
label: Project Task     # UI Label
description: Tracks individual units of work.
fields:
  name:
    type: text
    required: true
  status:
    type: select
    options: ["New", "In Progress", "Done"]
  project:
    type: lookup
    reference_to: project
    required: true
```

### 2.2 Valid Field Types (Updated 2026)
**Basic**: `text`, `textarea`, `markdown`, `html`, `number`, `currency`, `percent`, `boolean`, `password`
**Format**: `email`, `phone`, `url`
**Date**: `date`, `datetime`, `time`
**Media**: `file`, `image`, `avatar` (supports `multiple: true`)
**Geo**: `location`
**Relational**: `lookup`, `master_detail` (supports `reference_to`)
**Calculated**: `formula` (requires `expression`, `data_type`), `summary` (requires `summary_object`, `summary_type`, `summary_field`)
**System**: `auto_number` (requires `auto_number_format`), `grid`, `object`

### 2.3 Key Attributes
`required`, `unique`, `readonly`, `hidden`, `defaultValue`, `multiple`, `min`, `max`, `regex`

## 3. Query Syntax (JSON-based)
ObjectQL uses a unified JSON query format, NOT SQL.

### 3.1 Fetching Data
```typescript
const tasks = await context.object('project_task').find({
    fields: ['name', 'status', 'project.name'], // Support dot notation for lookups
    filters: [
        ['status', '=', 'In Progress'],
        'or',
        ['priority', '=', 'High']
    ],
    sort: [['created_at', 'desc']],
    skip: 0,
    limit: 20
});
```

### 3.2 Filtering Operators
`=`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `nin`, `contains`

## 4. Writing Hooks (`.hook.ts`)
Hooks intercept database operations.
**Triggers**: `beforeCreate`, `afterCreate`, `beforeUpdate`, `afterUpdate`, `beforeDelete`, `afterDelete`.

```typescript
// project_task.hook.ts
import { ObjectQLContext } from '@objectql/core';

export async function beforeCreate({ doc, ctx }: { doc: any, ctx: ObjectQLContext }) {
    if (doc.hours > 100) {
        throw new Error("Task duration too long");
    }
    doc.owner = ctx.userId; // Set default owner
}
```

## 5. Coding Conventions
1.  **Imports**: Always import types from `@objectql/core` or `@objectql/api`.
2.  **Async/Await**: All database operations are asynchronous.
3.  **No SQL**: Never write raw SQL. Use the Repository API (`find`, `create`, `update`, `delete`).
4.  **Validation**: Prefer schema-level validation (`min`, `regex`) inside `.object.yml` over code validation where possible.

