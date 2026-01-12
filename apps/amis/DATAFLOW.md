# AMIS Application Data Flow

## Overview

This document illustrates how data flows through the AMIS application from user interaction to backend API.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                        │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              AMIS Renderer Component                  │  │ │
│  │  │                                                        │  │ │
│  │  │  - Receives Schema Object                            │  │ │
│  │  │  - Renders UI Components                             │  │ │
│  │  │  - Handles User Actions                              │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ↑                                   │ │
│  │                          │ Schema                            │ │
│  │                          │                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              Schema Builder Utility                   │  │ │
│  │  │                                                        │  │ │
│  │  │  - Converts ObjectQL → AMIS                          │  │ │
│  │  │  - Maps Field Types                                   │  │ │
│  │  │  - Generates CRUD Schema                             │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                          ↑                                   │ │
│  │                          │ Metadata                          │ │
│  │                          │                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │               API Client (Axios)                      │  │ │
│  │  │                                                        │  │ │
│  │  │  GET  /api/metadata/objects                          │  │ │
│  │  │  GET  /api/metadata/:objectName                      │  │ │
│  │  │  POST /api/data/:objectName/query                    │  │ │
│  │  │  POST /api/data/:objectName                          │  │ │
│  │  │  PATCH /api/data/:objectName/:id                     │  │ │
│  │  │  DELETE /api/data/:objectName/:id                    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘  │ │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP/REST
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ObjectOS Server (NestJS)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Metadata Handler                          │  │
│  │                 (from @objectql/server)                   │  │
│  │                                                            │  │
│  │  - GET /api/metadata/objects                             │  │
│  │  - GET /api/metadata/:objectName                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   REST Handler                            │  │
│  │                 (from @objectql/server)                   │  │
│  │                                                            │  │
│  │  - POST /api/data/:objectName/query                      │  │
│  │  - POST /api/data/:objectName                            │  │
│  │  - PATCH /api/data/:objectName/:id                       │  │
│  │  - DELETE /api/data/:objectName/:id                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    ObjectOS Kernel                        │  │
│  │                (@objectos/kernel)                         │  │
│  │                                                            │  │
│  │  - Object Registry                                        │  │
│  │  - Metadata Parser                                        │  │
│  │  - Hook Execution                                         │  │
│  │  - Permission Checks                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Database Driver                         │  │
│  │               (@objectql/driver-sql)                      │  │
│  │                                                            │  │
│  │  - Query Building (Knex.js)                              │  │
│  │  - Schema Management                                      │  │
│  │  - Transaction Handling                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ SQL
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Database                                   │
│              (PostgreSQL / MySQL / SQLite)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: Create a Contact

### Step-by-Step Process

**1. User Opens Object Page**
```
User → Navigate to /object/contacts
     → ObjectPage.tsx loads
     → Fetches metadata: GET /api/metadata/contacts
```

**2. Schema Generation**
```
Metadata received:
{
  name: "contacts",
  fields: {
    first_name: { type: "text", required: true },
    email: { type: "email" }
  }
}

↓ schemaBuilder.ts converts to →

AMIS Schema:
{
  type: "crud",
  api: "/api/data/contacts/query",
  columns: [...],
  headerToolbar: [{
    type: "button",
    label: "新建",
    dialog: {
      body: {
        type: "form",
        api: "POST /api/data/contacts",
        fields: [
          { name: "first_name", type: "input-text", required: true },
          { name: "email", type: "input-email" }
        ]
      }
    }
  }]
}
```

**3. User Clicks "新建" Button**
```
AmisRenderer → Displays modal dialog with form
User fills in:
  - first_name: "John"
  - email: "john@example.com"
User clicks "提交"
```

**4. AMIS Submits Form**
```
AMIS automatically sends:
POST /api/data/contacts
Content-Type: application/json

{
  "first_name": "John",
  "email": "john@example.com"
}
```

**5. Server Processing**
```
NestJS receives request
  ↓
REST Handler (from @objectql/server)
  ↓
ObjectOS Kernel
  - Validates required fields
  - Runs beforeInsert hooks
  - Checks permissions
  ↓
KnexDriver
  - Builds SQL: INSERT INTO contacts (first_name, email) VALUES (?, ?)
  - Executes query
  ↓
Database
  - Stores record
  - Returns ID
  ↓
Response: { id: "123", first_name: "John", email: "john@example.com" }
```

**6. UI Updates**
```
AMIS receives response
  ↓
Closes modal dialog
  ↓
Automatically refreshes table
  ↓
Sends: POST /api/data/contacts/query
  ↓
Table displays new record
```

## Key Benefits of This Flow

1. **Zero Frontend Code**: No React components needed for CRUD operations
2. **Metadata-Driven**: Schema is generated dynamically from backend metadata
3. **Automatic Validation**: AMIS handles client-side validation from schema
4. **Consistent API**: All objects use same REST endpoints
5. **Type Safety**: TypeScript ensures type safety in schema building

## Field Type Transformation Example

```typescript
// ObjectQL Field Definition
{
  amount: {
    type: "currency",
    label: "Amount",
    required: true,
    min: 0
  }
}

        ↓ schemaBuilder.ts ↓

// AMIS Form Field
{
  name: "amount",
  label: "Amount",
  type: "input-number",
  required: true,
  min: 0,
  prefix: "$"
}

        ↓ AMIS Renders ↓

// HTML
<div class="form-group">
  <label>Amount *</label>
  <div class="input-group">
    <span class="input-group-addon">$</span>
    <input type="number" min="0" required />
  </div>
</div>
```

## Comparison: Traditional vs AMIS Approach

### Traditional React Approach

```tsx
// ContactForm.tsx (50+ lines)
function ContactForm({ onSubmit }) {
  const [data, setData] = useState({ first_name: '', email: '' });
  const [errors, setErrors] = useState({});
  
  const handleChange = (field, value) => { /* ... */ };
  const handleSubmit = async (e) => { /* ... */ };
  const validate = () => { /* ... */ };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name *</label>
        <input
          value={data.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
        />
        {errors.first_name && <span>{errors.first_name}</span>}
      </div>
      {/* More fields... */}
    </form>
  );
}
```

### AMIS Approach

```typescript
// schemaBuilder.ts generates this automatically
{
  type: "form",
  api: "POST /api/data/contacts",
  body: [
    { name: "first_name", type: "input-text", required: true },
    { name: "email", type: "input-email" }
  ]
}
```

**Result**: ~90% less code, automatic form handling, validation, and submission.

## Error Handling Flow

```
User submits invalid data
  ↓
AMIS validates client-side
  ↓
If valid → Sends to server
  ↓
Server validates (Kernel)
  ↓
If invalid → Returns 400 error
  ↓
AMIS displays error messages
  ↓
User corrects and resubmits
```

## Authentication Flow

```
User visits page
  ↓
AuthContext checks session
  ↓
GET /api/auth/session
  ↓
If no session → Redirect to /login
  ↓
User enters credentials
  ↓
POST /api/auth/signin
  ↓
Better-Auth validates
  ↓
Sets session cookie
  ↓
Redirect to home page
  ↓
All subsequent API calls include session cookie
```

## Conclusion

The AMIS approach provides a streamlined, low-code solution for building admin interfaces. By leveraging metadata and schema generation, it eliminates the need for repetitive CRUD component code while maintaining flexibility and type safety.
