# Query Language

The ObjectOS Query Language allows filtering, sorting, and pagination.

## Filters

Array of arrays format:

```json
[
  ["field_name", "operator", "value"],
  "and",
  ["other_field", "=", "value"]
]
```

## Operators

- `=`: Equals
- `!=`: Not Equals
- `>`: Greater than
- `<`: Less than
- `contains`: Text search
