# Object and Field Extension Guide

This guide explains how to override, extend, and delete object properties and fields in ObjectOS.

## Overview

ObjectOS supports a flexible metadata extension system that allows you to:

1. **Override** object properties (label, icon, description, etc.)
2. **Extend** objects by adding new fields
3. **Override** field properties (required, max_length, etc.)
4. **Delete** fields from base objects
5. **Deep merge** field sub-properties

This is particularly useful when:
- Customizing preset objects from packages
- Building multi-tenant applications with tenant-specific schemas
- Creating layered configurations (base → preset → application)

## Syntax

### Field Deletion

To delete a field, set it to `null`:

```yaml
# base/user.object.yml
name: user
fields:
  name:
    type: text
  email:
    type: email
  role:
    type: select
```

```yaml
# extended/user.object.yml
name: user
fields:
  role: null  # Delete the role field
```

Alternatively, use the explicit deletion marker:

```yaml
fields:
  role:
    _deleted: true
```

### Field Property Override

To override specific properties of a field without replacing the entire field:

```yaml
# base/product.object.yml
name: product
fields:
  sku:
    type: text
    label: SKU
    required: true
    unique: true
```

```yaml
# extended/product.object.yml
name: product
fields:
  sku:
    required: false  # Override: make SKU optional
    # unique: true is preserved
```

### Field Extension

To add new fields:

```yaml
# extended/product.object.yml
name: product
fields:
  # Add new fields
  brand:
    type: text
    label: Brand Name
  
  manufacturer:
    type: text
    label: Manufacturer
```

### Object Property Override

To override top-level object properties:

```yaml
# extended/product.object.yml
name: product
label: Extended Product  # Override label
description: Extended product with additional features  # Override description
icon: package-variant  # Override icon
```

## Examples

### Example 1: Customizing a Preset Object

You have a base `user` object from `@objectos/preset-base`:

```yaml
# @objectos/preset-base/user.object.yml
name: user
label: User
fields:
  name:
    type: text
    label: Name
    required: true
  
  email:
    type: email
    label: Email
    required: true
    unique: true
  
  role:
    type: select
    label: Role
    options:
      - label: User
        value: user
      - label: Admin
        value: admin
```

Extend it in your application:

```yaml
# your-app/user.object.yml
name: user
label: System User  # Override label
description: Application users with extended profile  # Add description

fields:
  # Override: make name optional
  name:
    required: false
    max_length: 100  # Add constraint
  
  # Delete: remove role field
  role: null
  
  # Extend: add new fields
  department:
    type: text
    label: Department
  
  phone:
    type: text
    label: Phone Number
    regex: '^\+?[1-9]\d{1,14}$'
```

Result:

```yaml
# Final merged object
name: user
label: System User
description: Application users with extended profile
fields:
  name:
    type: text
    label: Name
    required: false  # Overridden
    max_length: 100  # Added
  
  email:
    type: email
    label: Email
    required: true
    unique: true
  
  # role field deleted
  
  department:  # New field
    type: text
    label: Department
  
  phone:  # New field
    type: text
    label: Phone Number
    regex: '^\+?[1-9]\d{1,14}$'
```

### Example 2: Multi-layered Extension

ObjectOS supports multiple layers of extension:

```typescript
// Layer 1: Base definition
objectos.registerObject({
  name: 'contact',
  label: 'Contact',
  fields: {
    name: {
      type: 'text',
      label: 'Name',
      required: true
    },
    email: {
      type: 'email',
      label: 'Email'
    }
  }
});

// Layer 2: First extension
objectos.registerObject({
  name: 'contact',
  fields: {
    phone: {
      type: 'text',
      label: 'Phone'
    },
    name: {
      max_length: 100  // Add constraint
    }
  }
});

// Layer 3: Second extension
objectos.registerObject({
  name: 'contact',
  label: 'Customer Contact',  // Override label
  fields: {
    company: {
      type: 'text',
      label: 'Company'
    },
    email: null  // Delete email field
  }
});
```

Result:
- Label: "Customer Contact"
- Fields: name (required, max_length: 100), phone, company
- Email field is deleted

### Example 3: Field Sub-Property Extension

You can extend nested properties without replacing the entire field:

```yaml
# base/product.object.yml
name: product
fields:
  stock:
    type: number
    label: Stock Quantity
    min: 0
    default: 0
```

```yaml
# extended/product.object.yml
name: product
fields:
  stock:
    label: Inventory Count  # Override label
    help_text: "Current stock quantity in warehouse"  # Add help text
    # min: 0 and default: 0 are preserved
```

### Example 4: Array Property Override

Arrays are replaced completely (not merged):

```yaml
# base/task.object.yml
name: task
fields:
  status:
    type: select
    options:
      - label: Todo
        value: todo
      - label: Done
        value: done
```

```yaml
# extended/task.object.yml
name: task
fields:
  status:
    options:  # This replaces the entire options array
      - label: Backlog
        value: backlog
      - label: In Progress
        value: in_progress
      - label: Done
        value: done
```

## Programmatic API

You can also use the API programmatically:

```typescript
import { ObjectOS } from '@objectos/kernel';

const objectos = new ObjectOS();
await objectos.init();

// Register base object
objectos.registerObject({
  name: 'task',
  label: 'Task',
  fields: {
    title: { type: 'text', required: true }
  }
});

// Extend it
objectos.registerObject({
  name: 'task',
  label: 'Extended Task',
  fields: {
    title: { required: false },  // Override
    priority: { type: 'select' }  // Add
  }
});
```

## Configuration with Multiple Sources

When loading from multiple directories, objects are merged in order:

```typescript
const objectos = new ObjectOS({
  source: [
    './base-objects',      // Loaded first
    './custom-objects'     // Loaded second, can override base
  ]
});
```

Or with presets:

```typescript
const objectos = new ObjectOS({
  presets: [
    '@objectos/preset-base'  // Base definitions
  ],
  source: './custom-objects'  // Your overrides
});
```

## Best Practices

### 1. Use Explicit Names

Always include the object `name` in extension files:

```yaml
# ✓ Good
name: user
fields:
  department:
    type: text
```

```yaml
# ✗ Bad (name missing)
fields:
  department:
    type: text
```

### 2. Document Your Extensions

Add comments to explain why you're overriding or deleting:

```yaml
name: user
fields:
  # Remove role field - we use a separate permissions system
  role: null
  
  # Make email optional for social login users
  email:
    required: false
```

### 3. Preserve Critical Fields

Be careful when deleting fields that might be used by other parts of the system:

```yaml
# ✓ Consider if you really need to delete this
fields:
  created_at: null  # Careful! This might break audit trails
```

### 4. Test Your Extensions

Always test merged objects to ensure they work as expected:

```typescript
const user = objectos.getObject('user');
console.log('Fields:', Object.keys(user.fields));
// Verify expected fields are present/absent
```

### 5. Use Type Safety

When using TypeScript, cast partial field configs:

```typescript
objectos.registerObject({
  name: 'task',
  fields: {
    title: {
      required: false
    } as any  // Cast for partial field config
  }
});
```

## Merge Behavior

### Top-Level Properties

- **Strings/Numbers/Booleans**: Replaced
- **Objects**: Deep merged
- **Arrays**: Replaced completely

### Field-Level

- **New fields**: Added
- **Existing fields**: Deep merged
- **Null fields**: Deleted
- **Field properties**: Individual properties can be overridden

### Special Cases

#### Indexes

Indexes are merged by key:

```yaml
# base
indexes:
  email_idx:
    fields: [email]
    unique: true
```

```yaml
# extended
indexes:
  name_idx:  # Added
    fields: [name]
```

Result: Both indexes present.

#### Actions

Actions are merged by key:

```yaml
# base
actions:
  send_email:
    label: Send Email
```

```yaml
# extended
actions:
  send_sms:  # Added
    label: Send SMS
```

Result: Both actions present.

## Utilities

The merge utilities are exported for advanced use cases:

```typescript
import { 
  mergeObjectConfig, 
  mergeFieldConfig, 
  mergeFields,
  isDeleted,
  DELETED_MARKER 
} from '@objectos/kernel';

// Merge two object configs
const merged = mergeObjectConfig(baseConfig, overrideConfig);

// Check if a value is marked for deletion
if (isDeleted(field)) {
  console.log('Field is marked for deletion');
}

// Explicit deletion marker
const deletedField = { ...DELETED_MARKER };
```

## Troubleshooting

### Field Not Deleted

**Problem**: Field is still present after setting to null.

**Solution**: Ensure the object names match exactly:

```yaml
# This won't work - name mismatch
name: users  # Note the 's'
fields:
  role: null
```

```yaml
# Base object is 'user', not 'users'
name: user  # Correct
fields:
  role: null
```

### Properties Not Merged

**Problem**: Field properties are replaced instead of merged.

**Solution**: Ensure you're not redefining the entire field:

```yaml
# ✗ This replaces the entire field
fields:
  email:
    type: email
    required: false
```

```yaml
# ✓ This merges properties
fields:
  email:
    required: false  # Only override required
```

### Extension Order Matters

**Problem**: Extensions are applied in the wrong order.

**Solution**: ObjectOS loads files in the order specified:

```typescript
// Correct order
source: [
  './base',      // Loaded first
  './extended'   // Overrides base
]
```

## Related Documentation

- [Object Configuration](./objects.md)
- [Field Types](./fields.md)
- [Plugin System](./plugins.md)
- [Architecture Overview](../ARCHITECTURE.md)
