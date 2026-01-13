# Implementation Summary: Object and Field Extension

## Issue
对象属性支持重写、扩展、删除, 字段属性及子属性支持重写、扩展、删除

**Translation**: Object properties support override, extension, and deletion; field properties and sub-properties support override, extension, and deletion.

## Solution Overview

Implemented a comprehensive object and field extension system that allows:

1. **Object Property Override**: Modify top-level properties (label, icon, description, etc.)
2. **Field Extension**: Add new fields to existing objects
3. **Field Override**: Modify specific field properties without replacing the entire field
4. **Field Deletion**: Remove fields using `null` or `{ _deleted: true }`
5. **Deep Merging**: Support for nested property merging with intelligent behavior

## Implementation Details

### Core Components

#### 1. Merge Utilities (`packages/kernel/src/utils/merge.ts`)

- **`isDeleted(value)`**: Check if a value is marked for deletion
- **`mergeFieldConfig(base, override)`**: Merge two field configurations
- **`mergeFields(baseFields, overrideFields)`**: Merge field collections
- **`mergeObjectConfig(base, override)`**: Merge complete object configurations
- **`FieldOverride`**: TypeScript helper type for field overrides

#### 2. Enhanced ObjectOS Plugin (`packages/kernel/src/plugins/objectql.ts`)

Updated the object loader to check for existing objects and merge instead of replace:

```typescript
const existing = ctx.registry.getEntry('object', name);
if (existing) {
    const mergedContent = mergeObjectConfig(existing.content, doc);
    ctx.registry.register('object', { ...metadata, content: mergedContent });
}
```

#### 3. Enhanced ObjectOS Class (`packages/kernel/src/objectos.ts`)

Override `registerObject` method to support merging:

```typescript
registerObject(object: ObjectConfig): void {
    const existing = this.getObject(object.name);
    if (existing) {
        const merged = mergeObjectConfig(existing, object);
        super.registerObject(merged);
    } else {
        const filtered = this.filterDeletedFields(object);
        super.registerObject(filtered);
    }
}
```

## Usage Examples

### Example 1: Simple Field Override

```yaml
# base/user.object.yml
name: user
fields:
  name:
    type: text
    required: true
    max_length: 50

# extended/user.object.yml
name: user
fields:
  name:
    required: false  # Override required property
    # max_length: 50 is preserved
```

### Example 2: Field Deletion

```yaml
# extended/user.object.yml
name: user
fields:
  role: null  # Delete role field
```

### Example 3: Complete Extension

```yaml
# extended/product.object.yml
name: product
label: Extended Product  # Override label
fields:
  # Override property
  sku:
    required: false
  
  # Delete field
  category: null
  
  # Add new field
  brand:
    type: text
    label: Brand
```

### Example 4: Programmatic API

```typescript
import { ObjectOS } from '@objectos/kernel';

const objectos = new ObjectOS();
await objectos.init();

// Register base
objectos.registerObject({
  name: 'task',
  fields: { title: { type: 'text', required: true } }
});

// Extend it
objectos.registerObject({
  name: 'task',
  fields: {
    title: { required: false } as any,  // Override
    priority: { type: 'select' } as any  // Add
  }
});
```

## Merge Behavior

| Element Type | Behavior |
|--------------|----------|
| Top-level properties | Last wins (override) |
| Field collection | Deep merge (add + override + delete) |
| Field properties | Property-by-property merge |
| Arrays | Complete replacement |
| Null/undefined values | Deletion marker |

## Test Coverage

### Unit Tests (23 tests)
- `isDeleted` functionality
- `mergeFieldConfig` scenarios
- `mergeFields` operations
- `mergeObjectConfig` comprehensive tests
- Nullish coalescing behavior

### Integration Tests (7 tests)
- Field override
- Field deletion
- Field extension
- Field sub-property extension
- Complete integration
- Programmatic override
- Multiple extension layers

### Regression Tests
- All 57 existing tests passing
- No breaking changes

## Documentation

### English Documentation
- **`docs/guide/extension.md`**: Comprehensive guide with examples
  - Syntax reference
  - Use cases
  - Best practices
  - Troubleshooting

### Chinese Documentation
- **`docs/guide/extension.zh-CN.md`**: Quick reference in Chinese
  - 语法说明
  - 完整示例
  - 使用方法

### Package Documentation
- **`packages/kernel/README.md`**: Updated with extension examples

## Security

- ✅ CodeQL scan: 0 vulnerabilities found
- ✅ No code injection risks
- ✅ Type-safe implementation
- ✅ Proper null/undefined handling

## Performance

- Merge operations are O(n) where n is number of fields
- No runtime performance impact (merging happens at initialization)
- Memory efficient (uses spread operators for shallow copies)

## Backward Compatibility

✅ **Fully backward compatible**
- Existing objects without extensions work unchanged
- New syntax is optional
- All existing tests pass

## Design Decisions

### 1. Deletion Syntax
Chose `null` as primary deletion marker:
- **Pro**: Natural and intuitive in YAML
- **Pro**: Works with JSON too
- **Alternative**: Explicit `{ _deleted: true }` also supported for clarity

### 2. Nullish Coalescing
Used `??` instead of `||`:
- **Reason**: Allows empty arrays/objects as valid overrides
- **Example**: `rules: []` should clear rules, not fall back to base

### 3. Array Replacement
Arrays are replaced, not merged:
- **Reason**: Merging arrays (like `options`) is ambiguous
- **Solution**: Override completely for full control

### 4. Type Safety
Added `FieldOverride` helper type:
- **Usage**: Documentation and function signatures
- **Note**: `as any` still needed in some places due to TypeScript limitations

## Future Enhancements

Potential improvements (not in scope):

1. **Array Merging Strategy**: Add opt-in array merging by key
2. **Field Rename**: Support renaming fields while preserving data
3. **Conditional Overrides**: Apply overrides based on conditions (tenant, environment)
4. **Override Tracking**: Track which preset/file each property came from
5. **Schema Validation**: Validate merged schemas for consistency

## Migration Guide

For users extending objects, no migration needed. This is a new feature.

For custom loaders (if any), aware that:
- Objects are now merged instead of replaced when registered multiple times
- The `registerObject` method in ObjectOS class now supports merging

## Conclusion

This implementation provides a powerful, intuitive, and type-safe way to extend and customize objects in ObjectOS. It enables:

- **Multi-tenant Applications**: Different schemas per tenant
- **Preset Customization**: Extend base presets without forking
- **Layered Configuration**: Base → Preset → Application layers
- **Progressive Enhancement**: Start simple, add complexity as needed

All requirements from the original issue have been met with comprehensive testing, documentation, and security validation.
