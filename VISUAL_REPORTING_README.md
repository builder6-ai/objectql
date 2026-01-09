# Visual Multi-Table Reporting

A comprehensive visual reporting system for ObjectQL that enables users to create sophisticated multi-table reports without writing code, similar to Salesforce Reports and other low-code platforms.

## Quick Start

### 1. Define a Report (YAML)

Create a `.report.yml` file:

```yaml
# reports/my_report.report.yml
name: active_tasks
label: Active Tasks
type: tabular
object: tasks

columns:
  - field: name
    label: Task Name
  - field: project.name
    label: Project
  - field: assigned_to
    label: Assignee

filters:
  - - completed
    - "="
    - false

sort:
  - - due_date
    - asc
```

### 2. Use the Report Builder (React)

```tsx
import { ReportBuilder, ReportViewer } from '@objectql/ui';

function MyReportPage() {
  const [report, setReport] = useState(null);
  
  return (
    <ReportBuilder
      availableObjects={['tasks', 'projects', 'users']}
      onSave={(report) => setReport(report)}
      onPreview={(report) => runReport(report)}
    />
  );
}
```

### 3. Compile and Execute

```typescript
import { ReportCompiler } from '@objectql/core';

const compiler = new ReportCompiler();
const query = compiler.compile(reportDefinition);

// Execute the query
const results = await objectQL.find(reportDefinition.object, query);
```

## Features

### Multi-Table Joins

Access related data using dot notation:

```yaml
columns:
  - field: name              # Current object
  - field: project.name      # One level deep
  - field: project.owner.name  # Two levels deep
```

### Report Types

1. **Tabular** - Simple list view
2. **Summary** - Grouped with aggregations
3. **Matrix** - Cross-tabulation (pivot table)

### Grouping & Aggregations

```yaml
type: summary
groupings:
  - field: project.name
    sort: asc
aggregations:
  - field: id
    function: count
    label: Task Count
```

### Charts

```yaml
chart:
  type: bar
  groupBy: priority
  measure: id
  aggregation: count
```

## Documentation

- [Visual Reporting Guide](../../docs/guide/visual-reporting.md) - Complete guide (English)
- [中文文档](../../docs/VISUAL_REPORTING_CN.md) - Chinese documentation

## Examples

See `examples/project-management/src/reports/` for complete examples:

- `active_tasks.report.yml` - Simple list report
- `tasks_by_project_priority.report.yml` - Summary report with grouping
- `task_matrix.report.yml` - Matrix report

## Architecture

```
User Interface (React)
  ↓
ReportBuilder / ReportViewer Components
  ↓
Report Definition (YAML)
  ↓
ReportCompiler
  ↓
UnifiedQuery (JSON-DSL)
  ↓
ObjectQL Driver
  ↓
MongoDB / PostgreSQL
```

## API

### ReportCompiler

```typescript
const compiler = new ReportCompiler();

// Compile report to query
const query = compiler.compile(reportDefinition);

// Validate report definition
const { valid, errors } = compiler.validate(reportDefinition);

// Generate preview query (limited rows)
const previewQuery = compiler.compilePreview(reportDefinition, 10);
```

### React Components

**ReportBuilder**
```tsx
<ReportBuilder
  initialReport={report}
  availableObjects={['tasks', 'projects']}
  onSave={handleSave}
  onPreview={handlePreview}
/>
```

**ReportViewer**
```tsx
<ReportViewer
  report={reportDefinition}
  data={reportData}
  loading={false}
  onRefresh={handleRefresh}
  onExport={handleExport}
/>
```

## Best Practices

1. **Limit Relationship Depth**: Keep to 3-4 levels maximum
2. **Index Lookup Fields**: Ensure lookup fields are indexed
3. **Use Specific Fields**: Select only needed fields, not all
4. **Apply Filters Early**: Filter at the lowest level possible
5. **Cache Results**: Cache frequently accessed reports

## Testing

Run tests:

```bash
npm test --workspace=@objectql/core
```

Test files:
- `packages/core/test/report-compiler.test.ts`

## License

MIT
