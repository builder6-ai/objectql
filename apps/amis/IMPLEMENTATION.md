# AMIS Application Implementation Guide

## Overview

This document describes the implementation of the ObjectOS AMIS application - a low-code front-end built using Baidu's AMIS framework that provides automatic CRUD interfaces for system objects.

## What is AMIS?

AMIS (爱米斯) is an open-source low-code front-end framework developed by Baidu. It allows developers to create complex admin interfaces using JSON/JavaScript configuration instead of writing traditional React components.

**Key Benefits:**
- **Low-Code Development**: Define UIs with JSON schemas instead of code
- **Rich Components**: 100+ built-in components (forms, tables, charts, etc.)
- **Automatic CRUD**: Generate create, read, update, delete interfaces automatically
- **Theme Support**: Multiple built-in themes (cxd, antd, dark)
- **Mobile Responsive**: Works on desktop and mobile devices

## Architecture

```
apps/amis/
├── src/
│   ├── components/
│   │   └── AmisRenderer.tsx       # Core AMIS rendering component
│   ├── pages/
│   │   ├── Home.tsx               # Object list homepage
│   │   ├── Login.tsx              # Authentication page
│   │   └── ObjectPage.tsx         # Dynamic CRUD page per object
│   ├── utils/
│   │   ├── api.ts                 # Axios API client
│   │   └── schemaBuilder.ts       # ObjectQL → AMIS schema converter
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state management
│   └── lib/
│       └── auth.ts                # Better-Auth client
```

## How It Works

### 1. Schema Conversion

The `schemaBuilder.ts` file converts ObjectQL metadata to AMIS schemas:

```typescript
// ObjectQL Field Definition
{
  name: "contacts",
  fields: {
    first_name: {
      type: "text",
      label: "First Name",
      required: true
    },
    email: {
      type: "email",
      label: "Email",
      unique: true
    }
  }
}

// Converts to AMIS CRUD Schema
{
  type: "page",
  body: {
    type: "crud",
    api: "/api/data/contacts/query",
    columns: [
      { name: "first_name", label: "First Name", type: "text" },
      { name: "email", label: "Email", type: "text" }
    ],
    // ... form fields, filters, operations
  }
}
```

### 2. Field Type Mapping

| ObjectQL Type | AMIS Form Type | AMIS Table Type |
|--------------|----------------|-----------------|
| text | input-text | text |
| textarea | textarea | text |
| email | input-email | text |
| number | input-number | number |
| currency | input-number | number |
| select | select | text |
| multiselect | multi-select | text |
| date | input-date | date |
| datetime | input-datetime | datetime |
| checkbox | checkbox | status |
| lookup | select | text |
| url | input-url | link |

### 3. CRUD Operations

The AMIS CRUD component automatically provides:

**Table View:**
- Sortable columns
- Pagination (10, 20, 50, 100 per page)
- Bulk selection and actions
- Quick search and filters
- Column resizing

**Create/Edit Forms:**
- Modal dialogs for create/edit
- Field validation
- Required field indicators
- Related object selectors (for lookup fields)

**Operations:**
- Create: Click "新建" button → Modal form → POST to `/api/data/:object`
- Edit: Click "编辑" button → Modal form with data → PATCH to `/api/data/:object/:id`
- Delete: Click "删除" button → Confirmation → DELETE to `/api/data/:object/:id`
- Bulk Delete: Select multiple → "批量删除" → DELETE with IDs

## API Integration

The application integrates with ObjectOS server endpoints:

### Metadata Endpoints
```
GET /api/metadata/objects          # List all objects
GET /api/metadata/:objectName      # Get object metadata
```

### Data Endpoints
```
POST /api/data/:objectName/query   # Query records (with filters, sorting, pagination)
POST /api/data/:objectName         # Create record
PATCH /api/data/:objectName/:id    # Update record
DELETE /api/data/:objectName/:id   # Delete record
```

## Running the Application

### Development Mode

Start both the server and AMIS app:

```bash
# From project root
pnpm run dev:amis
```

This starts:
- **Server**: http://localhost:3000 (NestJS backend)
- **AMIS App**: http://localhost:5174 (Vite dev server)

The Vite dev server proxies `/api/*` requests to the backend server.

### Production Build

```bash
# Build AMIS app
cd apps/amis
pnpm run build

# Output in dist/ directory
```

## Features Implemented

### ✅ Authentication
- Login page with email/password
- Session management with Better-Auth
- Auto-redirect to login when unauthorized
- User info display in header

### ✅ Object List View
- Homepage showing all available objects
- Grid layout with object cards
- Object icon, label, and description display
- Click to navigate to object CRUD page

### ✅ Dynamic CRUD Pages
- Automatically generated from object metadata
- No code needed for new objects
- Supports all ObjectQL field types
- Responsive table and form layouts

### ✅ Table Features
- Server-side pagination
- Column sorting
- Advanced filters
- Bulk operations
- Export capabilities (AMIS built-in)

### ✅ Form Features
- Create and edit modes
- Field validation
- Required field indicators
- Help text and placeholders
- Related object lookups

### ✅ Internationalization
- Chinese UI labels (可切换为其他语言)
- Date/time formatting
- Number formatting for currency

## Customization Examples

### 1. Change Theme

Edit `src/components/AmisRenderer.tsx`:

```typescript
// Change from cxd to antd theme
import 'amis/lib/themes/antd.css';  // instead of cxd.css
```

Available themes: `cxd`, `antd`, `dark`

### 2. Add Custom Field Renderer

Edit `src/utils/schemaBuilder.ts`:

```typescript
// Add custom mapping for a new field type
export function objectqlTypeToAmisFormType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    // ... existing mappings
    gps_location: 'input-location',  // Add custom field type
  };
  return typeMap[fieldType] || 'input-text';
}
```

### 3. Customize Table Actions

Modify the CRUD schema in `buildAmisCRUDSchema()`:

```typescript
columns: [
  // ... existing columns
  {
    type: 'operation',
    label: '操作',
    buttons: [
      { label: '编辑', type: 'button', actionType: 'dialog', ... },
      { label: '删除', type: 'button', actionType: 'ajax', ... },
      // Add custom action
      {
        label: '发送邮件',
        type: 'button',
        actionType: 'ajax',
        api: '/api/data/contacts/$id/send-email'
      }
    ]
  }
]
```

## Advantages of AMIS Approach

### vs. Traditional React Components

**Traditional Approach:**
```tsx
// Need to write custom code for each object
function ContactsTable() {
  const [data, setData] = useState([]);
  // ... 50+ lines of state, effects, handlers
  return (
    <table>
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  );
}
```

**AMIS Approach:**
```typescript
// Just configuration
{
  type: "crud",
  api: "/api/data/contacts/query",
  columns: [...]
}
```

### Benefits:
1. **Less Code**: ~90% reduction in component code
2. **Faster Development**: New objects require zero frontend code
3. **Consistency**: All CRUD pages follow same pattern
4. **Maintainability**: Changes in one place affect all pages
5. **AI-Friendly**: Easy to generate schemas with AI

## Limitations and Trade-offs

1. **Learning Curve**: Need to learn AMIS schema syntax
2. **Customization**: Deep customizations may require AMIS source understanding
3. **Bundle Size**: AMIS library is ~2.5MB (but code-splittable)
4. **TypeScript Support**: AMIS types are not 100% complete

## Future Enhancements

### Potential Improvements:
1. **Custom Actions**: Add workflow triggers to table operations
2. **Advanced Filters**: More complex filter conditions
3. **Charts and Reports**: Add dashboard pages with AMIS charts
4. **Import/Export**: Excel import/export functionality
5. **Mobile App**: React Native with AMIS-Mobile
6. **Theme Customization**: Custom color schemes
7. **Localization**: Multi-language support

## Comparison with apps/web

| Feature | apps/web | apps/amis |
|---------|----------|-----------|
| UI Framework | React + AG Grid | React + AMIS |
| Development Style | Component-based | Schema-based |
| Lines of Code | ~5000 | ~1500 |
| Customization | High | Medium-High |
| Bundle Size | ~500KB | ~2.5MB |
| Mobile Support | Limited | Good |
| Learning Curve | React expertise | AMIS schema knowledge |

## Conclusion

The AMIS implementation provides a rapid, low-code alternative to building admin interfaces. It's ideal for:

- **Rapid Prototyping**: Get CRUD interfaces in minutes
- **Internal Tools**: Admin panels that don't need pixel-perfect designs
- **AI-Generated UIs**: Schemas are easy for AI to generate
- **Metadata-Driven Apps**: Perfect for ObjectOS's approach

For projects requiring highly customized UIs or specific performance requirements, the traditional `apps/web` approach may be more suitable.
