# ObjectOS Plugin Examples

This directory contains reference implementations of ObjectOS web framework plugins.

## Available Examples

### 1. Table Plugins
- [**simple-table**](./simple-table/) - Minimal table plugin implementation
- [**advanced-table**](./advanced-table/) - Feature-rich table with sorting, filtering, and export

### 2. Form Plugins
- [**simple-form**](./simple-form/) - Basic form with validation
- [**multi-step-form**](./multi-step-form/) - Multi-step form wizard

### 3. Chart Plugins
- [**simple-chart**](./simple-chart/) - Basic charting plugin

### 4. Utility Plugins
- [**analytics**](./analytics/) - Analytics tracking plugin
- [**export**](./export/) - Data export plugin (CSV, Excel, PDF)
- [**theme**](./theme/) - Custom theme plugin

## Quick Start

Each example includes:
- `src/` - Plugin source code
- `README.md` - Documentation and usage
- `package.json` - Dependencies and scripts
- `examples/` - Usage examples

To try an example:

```bash
cd examples/plugins/simple-table
pnpm install
pnpm dev
```

## Creating Your Own Plugin

Use the official plugin template:

```bash
git clone https://github.com/objectql/plugin-template my-plugin
cd my-plugin
pnpm install
pnpm dev
```

## Documentation

- [Web Framework Specification](../../docs/spec/web-framework.md)
- [Plugin Development Guide](../../docs/guide/plugin-development.md)

## Community

- **Plugin Registry**: https://plugins.objectos.org
- **Discord**: https://discord.gg/objectos
- **GitHub**: https://github.com/objectql/objectos
