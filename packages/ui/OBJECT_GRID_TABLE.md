# ObjectGridTable - Metadata-Driven AG Grid Component

## Overview

`ObjectGridTable` is a powerful, metadata-driven AG Grid component that automatically generates column definitions and cell renderers based on ObjectQL object metadata (`ObjectConfig`). This component eliminates the need to manually configure columns and cell renderers for each field type.

## Features

- **Automatic Column Generation**: Columns are automatically generated from `ObjectConfig.fields`
- **Type-Aware Cell Renderers**: Each field type gets an appropriate cell renderer:
  - `boolean`: Checkmark/X icon display
  - `date`/`datetime`: Formatted date with calendar icon
  - `number`/`currency`/`percent`: Numeric formatting with proper alignment
  - `select`: Badge display with option labels
  - `lookup`/`master_detail`: Relationship display
  - `email`: Clickable mailto link
  - `url`: Clickable external link
  - `text`, `textarea`, etc.: Default text display
- **Responsive Column Widths**: Automatic width hints based on field type
- **Full AG Grid Features**: Sorting, filtering, pagination, row selection
- **TypeScript Support**: Full type safety with ObjectQL types

## Installation

The component is part of `@objectos/ui` package:

```bash
npm install @objectos/ui
```

## Basic Usage

```tsx
import { ObjectGridTable } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';

// Define your object metadata
const userConfig: ObjectConfig = {
  name: 'user',
  label: 'Users',
  fields: {
    name: {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    is_active: {
      name: 'is_active',
      label: 'Active',
      type: 'boolean',
    },
    created_at: {
      name: 'created_at',
      label: 'Created',
      type: 'datetime',
    },
  },
};

// Your data
const users = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    is_active: true,
    created_at: new Date('2024-01-15'),
  },
  // ... more users
];

function UserList() {
  return (
    <ObjectGridTable
      objectConfig={userConfig}
      data={users}
      height={600}
      pagination={true}
      pageSize={20}
    />
  );
}
```

## Props

### ObjectGridTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `objectConfig` | `ObjectConfig` | **Required** | Object metadata configuration |
| `data` | `any[]` | **Required** | Array of row data to display |
| `height` | `string \| number` | `600` | Height of the grid (pixels or CSS value) |
| `pagination` | `boolean` | `true` | Enable pagination |
| `pageSize` | `number` | `10` | Number of rows per page |
| `rowSelection` | `boolean \| 'single' \| 'multiple'` | `false` | Enable row selection |
| `onGridReady` | `(params: GridReadyEvent) => void` | - | Callback when grid is ready |
| `onCellClicked` | `(event: CellClickedEvent) => void` | - | Callback when cell is clicked |
| `onSelectionChanged` | `(selectedRows: any[]) => void` | - | Callback when selection changes |
| `additionalColumns` | `ColDef[]` | `[]` | Additional AG Grid column definitions |

## Field Type Support

### Text-based Fields

- `text`, `textarea`, `markdown`, `html`
- Rendered as plain text with default AG Grid renderer
- Textarea and markdown fields get more width (flex: 2)

### Boolean Fields

```tsx
{
  is_active: {
    type: 'boolean',
    label: 'Active',
  }
}
```

Renders as:
- ✓ Green checkmark for `true`
- ✗ Gray X for `false`
- `-` for null/undefined

### Date/DateTime Fields

```tsx
{
  created_at: {
    type: 'datetime',
    label: 'Created At',
  },
  due_date: {
    type: 'date',
    label: 'Due Date',
  }
}
```

Renders with calendar icon and formatted date:
- `date`: "Jan 15, 2026"
- `datetime`: "Jan 15, 2026, 2:30 PM"

### Numeric Fields

```tsx
{
  price: {
    type: 'currency',
    label: 'Price',
  },
  progress: {
    type: 'percent',
    label: 'Progress',
  },
  count: {
    type: 'number',
    label: 'Count',
  }
}
```

Renders with proper formatting and right alignment:
- `currency`: "$1,234.56"
- `percent`: "75.50%"
- `number`: "1,234"

### Select Fields

```tsx
{
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  }
}
```

Renders as a badge with the option label.

### Lookup/Relationship Fields

```tsx
{
  assignee: {
    type: 'lookup',
    label: 'Assignee',
    reference_to: 'user',
  }
}
```

Handles both object values and IDs:
- Object: Displays `name`, `label`, `title`, or `_id`
- Primitive: Displays the value directly

### Email Fields

```tsx
{
  email: {
    type: 'email',
    label: 'Email',
  }
}
```

Renders as clickable mailto link.

### URL Fields

```tsx
{
  website: {
    type: 'url',
    label: 'Website',
  }
}
```

Renders as clickable external link (opens in new tab).

## Advanced Usage

### With Row Selection

```tsx
function UserListWithSelection() {
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  return (
    <>
      <div className="mb-4">
        Selected: {selectedUsers.length} users
      </div>
      <ObjectGridTable
        objectConfig={userConfig}
        data={users}
        rowSelection="multiple"
        onSelectionChanged={setSelectedUsers}
      />
    </>
  );
}
```

### With Custom Additional Columns

```tsx
import type { ColDef } from 'ag-grid-community';

const actionColumn: ColDef = {
  field: 'actions',
  headerName: '',
  width: 100,
  cellRenderer: (params) => (
    <button onClick={() => handleEdit(params.data)}>
      Edit
    </button>
  ),
};

function UserListWithActions() {
  return (
    <ObjectGridTable
      objectConfig={userConfig}
      data={users}
      additionalColumns={[actionColumn]}
    />
  );
}
```

### Fetching Data from API

```tsx
function UserListFromAPI() {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState<ObjectConfig | null>(null);

  useEffect(() => {
    // Fetch metadata
    fetch('/api/metadata/object/user')
      .then(res => res.json())
      .then(setConfig);

    // Fetch data
    fetch('/api/data/user')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!config) return <div>Loading...</div>;

  return (
    <ObjectGridTable
      objectConfig={config}
      data={data}
      height="calc(100vh - 200px)"
    />
  );
}
```

## Integration with ObjectOS

The component is designed to work seamlessly with ObjectOS architecture:

```tsx
import { ObjectOS } from '@objectos/kernel';

function ObjectListView({ objectName }: { objectName: string }) {
  const [data, setData] = useState([]);
  const kernel = useContext(KernelContext); // Your kernel instance

  useEffect(() => {
    // Fetch data using kernel
    kernel.find(objectName, {})
      .then(setData)
      .catch(console.error);
  }, [objectName]);

  const objectConfig = kernel.getObject(objectName);

  return (
    <ObjectGridTable
      objectConfig={objectConfig}
      data={data}
    />
  );
}
```

## Styling

The component uses AG Grid's Alpine theme with dark mode support:

```tsx
<div className="ag-theme-alpine dark:ag-theme-alpine-dark">
  <ObjectGridTable ... />
</div>
```

Custom styling is automatically applied via the included CSS in `@objectos/ui`.

## Performance

- **Virtual Scrolling**: Only visible rows are rendered
- **Memoized Columns**: Column definitions are memoized based on `objectConfig`
- **Efficient Updates**: AG Grid's change detection is optimized

## Comparison with DataTable/AgGridTable

| Feature | ObjectGridTable | DataTable/AgGridTable |
|---------|----------------|----------------------|
| Column Configuration | Automatic from metadata | Manual column definitions |
| Cell Renderers | Automatic based on field type | Manual per column |
| Type Support | All ObjectQL field types | Custom implementation needed |
| Use Case | Object-based views | Custom tables with specific columns |
| Learning Curve | Low (just provide metadata) | Medium (need to understand AG Grid) |

## Best Practices

1. **Use with Object Metadata**: Always define comprehensive `ObjectConfig` with proper field types
2. **Hidden Fields**: Set `hidden: true` for fields like `_id`, `__v` that shouldn't be displayed
3. **Field Labels**: Provide clear `label` values for better UX
4. **Handle Loading**: Show loading state while fetching metadata and data
5. **Error Handling**: Wrap in error boundaries for production use

## Limitations

- Requires `@objectql/types` to be installed
- Does not support inline editing (use custom cell renderers if needed)
- Complex nested objects may need custom renderers
- Image/file fields use default text renderer (extend with custom renderers)

## Examples

See `packages/ui/src/components/examples/ObjectGridTableExample.tsx` for a complete working example with all field types.

## License

Part of the ObjectOS project. See repository license for details.
