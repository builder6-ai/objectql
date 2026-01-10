# Metadata Format

ObjectOS uses strict YAML schemas for defining application metadata.

## Object Schema

```yaml
code: <string>
label?: <string>
description?: <string>
fields:
  <field_name>:
    type: <field_type>
    label?: <string>
    required?: <boolean>
```

## Field Types

Detailed specification of supported field types like `text`, `number`, `boolean`, `datetime`, `lookup`, `master_detail` etc.
