# ObjectQL Field Type Mapping for AMIS

This document maps the official ObjectQL field types (from https://github.com/objectql/objectql) to AMIS components.

## Official ObjectQL Field Types

According to the ObjectQL specification (`docs/spec/object.md`), the following field types are defined:

### Basic Types
- `text` - Single line text
- `textarea` - Multiline text
- `markdown` - Markdown formatted text
- `html` - Rich text content (HTML)
- `number` - Numeric value (integer or float)
- `currency` - Monetary value
- `percent` - Percentage value (0-1)
- `boolean` - true or false

### System/Format Types
- `email` - Email address with validation
- `phone` - Phone number formatting
- `url` - Web URL validation
- `password` - Encrypted or masked string

### Date & Time
- `date` - Date only (YYYY-MM-DD)
- `datetime` - Date and time (ISO string)
- `time` - Time only (HH:mm:ss)

### Complex/Media
- `file` - File attachment (stored as JSON)
- `image` - Image attachment (stored as JSON)
- `avatar` - User avatar image
- `location` - Geolocation (lat/lng JSON)

### Relationships
- `select` - Selection from a list
- `lookup` - Reference to another object
- `master_detail` - Strong ownership relationship

### Advanced
- `formula` - Read-only calculated field
- `summary` - Roll-up summary of child records
- `auto_number` - Auto-incrementing unique identifier
- `object` - JSON object structure
- `grid` - Array of objects/rows
- `vector` - Vector embedding for AI search

## AMIS Mapping

### Current Implementation

| ObjectQL Type | AMIS Form Component | AMIS Table Column | Status |
|--------------|---------------------|-------------------|--------|
| **Basic Types** | | | |
| text | input-text | text | ✅ Implemented |
| textarea | textarea | text | ✅ Implemented |
| markdown | textarea | text | ⚠️ Needs markdown editor |
| html | rich-text | - | ✅ Implemented |
| number | input-number | number | ✅ Implemented |
| currency | input-number | number | ✅ Implemented |
| percent | input-number | number | ✅ Implemented |
| boolean | checkbox | status | ✅ Implemented |
| **System/Format Types** | | | |
| email | input-email | text | ✅ Implemented |
| phone | input-text | text | ✅ Implemented |
| url | input-url | link | ✅ Implemented |
| password | input-password | - | ✅ Implemented |
| **Date & Time** | | | |
| date | input-date | date | ✅ Implemented |
| datetime | input-datetime | datetime | ✅ Implemented |
| time | input-time | time | ✅ Implemented |
| **Complex/Media** | | | |
| file | input-file | link | ⚠️ Needs enhancement |
| image | input-image | image | ✅ Implemented |
| avatar | input-image | image | ✅ Implemented (as image) |
| location | input-text | text | ⚠️ Needs map component |
| **Relationships** | | | |
| select | select | text | ✅ Implemented |
| lookup | select | mapping | ✅ Implemented |
| master_detail | select | mapping | ✅ Implemented |
| **Advanced** | | | |
| formula | static | text | ⚠️ Read-only display |
| summary | static | number | ⚠️ Read-only display |
| auto_number | static | text | ⚠️ Read-only display |
| object | input-kv | json | ⚠️ Needs JSON editor |
| grid | input-table | - | ⚠️ Needs nested table |
| vector | - | - | ❌ Not applicable for AMIS |

### Legacy/Non-Standard Types (to be removed)

The following types were implemented but are NOT in the ObjectQL spec:

- `checkbox` - Should use `boolean`
- `switch` - Should use `boolean` with UI hint
- `picklist` - Should use `select`
| `multiselect` - Should use `select` with `multiple: true`
- `slider` - Should use `number` with UI hint
- `color` - Should use `text` with color picker hint
- `rating` - Should use `number` with rating display

## Recommended Changes

### 1. Align with ObjectQL Spec

Update `schemaBuilder.ts` to:
- Remove non-standard types (checkbox, switch, picklist, multiselect, slider, color, rating)
- Use `boolean` for all true/false fields
- Use `select` for all dropdown selections
- Add `markdown`, `avatar`, `location` support
- Add `formula`, `summary`, `auto_number`, `object`, `grid` support

### 2. UI Hints for Boolean Display

Instead of separate `checkbox` and `switch` types, use field-level hints:

```yaml
# ObjectQL definition
enabled:
  type: boolean
  ui_hint: switch  # or checkbox (default)
```

### 3. Multi-Select via Property

```yaml
# ObjectQL definition
tags:
  type: select
  options: [...]
  multiple: true  # Makes it multi-select
```

### 4. Advanced Field Support

For read-only advanced types:

```yaml
# Formula
total_price:
  type: formula
  expression: "quantity * unit_price"
  data_type: currency  # Result type
  
# Auto number
invoice_number:
  type: auto_number
  auto_number_format: "INV-{YYYY}-{0000}"
```

## Migration Path

To maintain backward compatibility while aligning with ObjectQL:

1. **Phase 1** (Current): Support both old and new types
   - Map `checkbox` → `boolean`
   - Map `switch` → `boolean` 
   - Map `picklist` → `select`
   - Map `multiselect` → `select` with multiple

2. **Phase 2**: Add ObjectQL-only types
   - `markdown`, `avatar`, `location`
   - `formula`, `summary`, `auto_number`
   - `object`, `grid`

3. **Phase 3**: Deprecate non-standard types
   - Show warnings for checkbox, switch, etc.
   - Update documentation

## Field-Specific Properties

### From ObjectQL Spec

| Type | Properties |
|------|-----------|
| text | `min_length`, `max_length`, `regex` |
| textarea | `rows`, `min_length`, `max_length` |
| number | `precision`, `min`, `max` |
| currency | `scale`, `min`, `max` |
| percent | `scale`, `min`, `max` |
| file | `multiple` |
| image | `multiple` |
| select | `options`, `multiple` |
| lookup | `reference_to`, `multiple` |
| master_detail | `reference_to` (required) |
| formula | `expression`, `data_type` |
| summary | `summary_object`, `summary_type`, `summary_field`, `summary_filters` |
| auto_number | `auto_number_format` |
| location | - |
| vector | `dimension` |

## Summary

- **Total ObjectQL Types**: 26
- **Currently Implemented**: 23 (with 7 non-standard)
- **Needs Implementation**: 6 (markdown, avatar, location, formula, summary, auto_number, object, grid, vector)
- **Needs Deprecation**: 7 (checkbox→boolean, switch→boolean, picklist→select, multiselect→select, slider, color, rating)
