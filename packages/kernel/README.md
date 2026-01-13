# @objectos/kernel

The core runtime for ObjectOS, extending ObjectQL with application-specific capabilities.

## Features

- **ObjectOS Runtime**: Extends `ObjectQL` to provide a full application kernel.
- **App Metadata**: Built-in support for loading `.app.yml` for application configuration and navigation.
- **Data Loading**: Built-in support for loading `.data.yml` for seed data.
- **Object Extension**: Support for overriding, extending, and deleting object properties and fields.
- **MetadataRegistry**: Inherits the central metadata store from ObjectQL.

## Installation

```bash
npm install @objectos/kernel
```

## Usage

### Basic Usage

`ObjectOS` is a drop-in replacement for `ObjectQL`. It automatically registers plugins to handle ObjectOS specific metadata formats.

```typescript
import { ObjectOS } from '@objectos/kernel';

const kernel = new ObjectOS({
    datasources: {
        'default': {
             client: 'sqlite3',
             connection: { filename: ':memory:' }
        }
    }
});

// Initialize (connects to DB, loads plugins)
await kernel.init();

// Use standard ObjectQL methods
const users = await kernel.find('user', {});
```

### Metadata Loading

The kernel automatically scans for:
- `*.object.yml` (Standard ObjectQL)
- `*.app.yml` (ObjectOS Apps)
- `*.data.yml` (ObjectOS Data Seeding)

```yaml
# my-app.app.yml
code: my_crm
name: CRM
icon: users
menu:
  - type: header
    label: Sales
  - type: object
    object: lead
```

### Object Extension

ObjectOS supports extending and overriding object definitions:

```yaml
# base/user.object.yml
name: user
label: User
fields:
  name:
    type: text
    required: true
  email:
    type: email
    required: true
  role:
    type: select
```

```yaml
# extended/user.object.yml
name: user
label: System User  # Override label

fields:
  # Override field property
  name:
    required: false
    max_length: 100
  
  # Delete field
  role: null
  
  # Add new field
  department:
    type: text
    label: Department
```

**Result**: The user object will have:
- Label: "System User"
- name field: optional, max 100 chars
- email field: unchanged
- department field: added
- role field: deleted

See [Extension Guide](../../docs/guide/extension.md) for details.

## API

### `ObjectOS`

Extends `ObjectQL` class.

- `constructor(config)`
  - `config.datasources`: Database connections.
  - `config.packages`: List of NPM packages to scan for metadata.
  - `config.source`: Path(s) to directories containing metadata files.
  - `config.presets`: List of preset packages to load.

- `registerObject(object)`: Register or extend an object definition. If the object already exists, it will be merged with the new definition.

### Extension Utilities

```typescript
import { 
  mergeObjectConfig,   // Merge two object configurations
  mergeFieldConfig,    // Merge two field configurations
  mergeFields,         // Merge field collections
  isDeleted,           // Check if a value is marked for deletion
  DELETED_MARKER       // Deletion marker constant
} from '@objectos/kernel';

// Example: Manual merge
const merged = mergeObjectConfig(baseConfig, overrideConfig);

// Example: Check deletion
if (isDeleted(field)) {
  console.log('Field is marked for deletion');
}
```

### Plugins

Internal plugins are automatically registered:

- **ObjectOSPlugin**: Loads objects, apps, and data files with merge support.

