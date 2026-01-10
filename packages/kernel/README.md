# @objectos/kernel

The core runtime for ObjectOS, extending ObjectQL with application-specific capabilities.

## Features

- **ObjectOS Runtime**: Extends `ObjectQL` to provide a full application kernel.
- **App Metadata**: Built-in support for loading `.app.yml` for application configuration and navigation.
- **Data Loading**: Built-in support for loading `.data.yml` for seed data.
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

## API

### `ObjectOS`

Extends `ObjectQL` class.

- `constructor(config)`
  - `config.datasources`: Database connections.
  - `config.packages`: List of NPM packages to scan for metadata.

### Plugins

Internal plugins are automatically registered:

- **AppPlugin**: Loads `**/*.app.yml`
- **DataPlugin**: Loads `**/*.data.yml`
