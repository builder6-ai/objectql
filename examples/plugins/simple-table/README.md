# Simple Table Plugin

A minimal ObjectOS table plugin that demonstrates the basic plugin architecture.

## Features

- ✅ Basic table rendering
- ✅ Column sorting
- ✅ Row click handling
- ✅ Responsive design
- ✅ TypeScript support

## Installation

```bash
npm install @example/simple-table-plugin
# or
pnpm add @example/simple-table-plugin
```

## Usage

```typescript
import { createFramework } from '@objectos/web-framework';
import { SimpleTablePlugin } from '@example/simple-table-plugin';

const framework = createFramework({
  plugins: [
    new SimpleTablePlugin()
  ]
});

// Use in your components
function MyView() {
  const Table = framework.components.get('table');
  
  return (
    <Table 
      data={data}
      columns={columns}
      onRowClick={handleRowClick}
    />
  );
}
```

## Configuration

The plugin accepts optional configuration:

```typescript
new SimpleTablePlugin({
  striped: true,        // Alternate row colors
  hoverable: true,      // Highlight row on hover
  bordered: true,       // Show borders
  compact: false        // Compact spacing
})
```

## API

### Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `any[]` | Array of data objects |
| `columns` | `Column[]` | Column definitions |
| `onRowClick` | `(row: any) => void` | Row click handler |
| `onSort` | `(sort: SortState) => void` | Sort handler |
| `sorting` | `SortState` | Current sort state |

### Column Definition

```typescript
interface Column {
  id: string;
  field: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}
```

## Examples

### Basic Table

```typescript
const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

const columns = [
  { id: 'name', field: 'name', label: 'Name' },
  { id: 'email', field: 'email', label: 'Email' }
];

<Table data={data} columns={columns} />
```

### With Sorting

```typescript
const [sorting, setSorting] = useState({ field: 'name', order: 'asc' });

<Table 
  data={data} 
  columns={columns}
  sorting={sorting}
  onSort={setSorting}
/>
```

### Custom Cell Rendering

```typescript
const columns = [
  { 
    id: 'name', 
    field: 'name', 
    label: 'Name',
    render: (value, row) => (
      <strong>{value}</strong>
    )
  },
  { 
    id: 'status', 
    field: 'status', 
    label: 'Status',
    render: (value) => (
      <Badge color={value === 'active' ? 'green' : 'gray'}>
        {value}
      </Badge>
    )
  }
];
```

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build
pnpm build

# Test
pnpm test
```

## License

MIT
