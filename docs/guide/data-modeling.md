# Data Modeling

ObjectOS uses YAML to define data models.

## Object Definition

Files named `*.object.yml` define your entities.

```yaml
code: project
label: Project
fields:
  name:
    label: Project Name
    type: text
    required: true
```

## Field Types

- `text`
- `number`
- `currency`
- `lookup` (Relationship)
