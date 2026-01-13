# Plugin Development Guide

This guide provides detailed instructions for creating ObjectOS web framework plugins. It is intended for developers who want to extend the framework or contribute to the plugin ecosystem.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Plugin Anatomy](#2-plugin-anatomy)
3. [Component Plugins](#3-component-plugins)
4. [Publishing Plugins](#4-publishing-plugins)
5. [Best Practices](#5-best-practices)
6. [Testing](#6-testing)
7. [Examples](#7-examples)

---

## 1. Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- TypeScript 5+
- React 18+
- Basic understanding of ObjectOS architecture

### Quick Start

Use the official plugin template to bootstrap a new plugin:

```bash
# Clone the plugin template
git clone https://github.com/objectql/plugin-template my-plugin
cd my-plugin

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Project Structure

```
my-plugin/
├── src/
│   ├── index.ts           # Plugin entry point
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── examples/             # Usage examples
├── tests/                # Test files
├── package.json          # npm package configuration
├── plugin.manifest.json  # Plugin manifest (required)
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## 2. Plugin Anatomy

### 2.1 Basic Plugin Structure

Every plugin must implement the `IObjectOSPlugin` interface:

```typescript
// src/index.ts
import type { IObjectOSPlugin, PluginContext, PluginMetadata, PluginCapabilities } from '@objectos/web-framework';

export class MyPlugin implements IObjectOSPlugin {
  // Required: Unique identifier (use npm package naming)
  name = '@myorg/objectos-plugin-name';
  
  // Required: Semantic version
  version = '1.0.0';
  
  // Required: Enhanced plugin metadata (for marketplace)
  metadata: PluginMetadata = {
    displayName: 'My Awesome Plugin',
    description: 'Does something amazing',
    longDescription: '# My Plugin\n\nDetailed description with markdown support...',
    author: 'Your Name or Company',
    homepage: 'https://github.com/myorg/my-plugin',
    category: 'table', // or 'form', 'chart', 'utility', etc.
    icon: 'https://cdn.myorg.com/icon.svg',
    screenshots: [
      'https://cdn.myorg.com/screenshot1.png',
      'https://cdn.myorg.com/screenshot2.png'
    ],
    license: 'MIT', // or 'Commercial', 'GPL', etc.
    pricing: {
      type: 'free' // or 'paid', 'freemium', 'subscription'
    },
    links: {
      documentation: 'https://docs.myorg.com',
      support: 'https://support.myorg.com',
      changelog: 'https://github.com/myorg/my-plugin/releases',
      repository: 'https://github.com/myorg/my-plugin'
    },
    tags: ['table', 'data-grid', 'enterprise']
  };
  
  // Required: Capability declaration
  capabilities: PluginCapabilities = {
    provides: {
      components: ['table'],
      services: ['export']
    },
    features: {
      sorting: true,
      filtering: true,
      export: true
    }
  };
  
  // Optional: Dependencies on other plugins
  dependencies?: string[] = [];
  
  // Required: Initialize the plugin
  async initialize(context: PluginContext): Promise<void> {
    // Plugin initialization logic
    console.log('Plugin initialized!');
  }
  
  // Optional: Cleanup when plugin is destroyed
  async destroy(): Promise<void> {
    // Cleanup logic
  }
}
```

### 2.2 Plugin Manifest File

Create `plugin.manifest.json` in the root of your plugin package:

```json
{
  "name": "@myorg/objectos-plugin-name",
  "version": "1.0.0",
  "frameworkVersion": ">=0.1.0",
  "metadata": {
    "displayName": "My Awesome Plugin",
    "description": "Does something amazing",
    "longDescription": "# My Plugin\n\nDetailed description...",
    "author": "Your Name or Company",
    "homepage": "https://github.com/myorg/my-plugin",
    "category": "table",
    "icon": "https://cdn.myorg.com/icon.svg",
    "screenshots": [
      "https://cdn.myorg.com/screenshot1.png"
    ],
    "license": "MIT",
    "pricing": {
      "type": "free"
    },
    "links": {
      "documentation": "https://docs.myorg.com",
      "support": "https://support.myorg.com",
      "repository": "https://github.com/myorg/my-plugin"
    },
    "tags": ["table", "data-grid"]
  },
  "capabilities": {
    "provides": {
      "components": ["table"],
      "services": ["export"]
    },
    "features": {
      "sorting": true,
      "filtering": true
    }
  },
  "dependencies": [],
  "permissions": [
    "storage.read",
    "storage.write"
  ]
}
```
  }
}
```

### 2.2 Plugin Context

The `PluginContext` provides access to framework services:

```typescript
interface PluginContext {
  // Plugin registry - manage other plugins
  registry: PluginRegistry;
  
  // Event bus - pub/sub communication
  events: EventBus;
  
  // Component registry - register/override components
  components: ComponentRegistry;
  
  // Theme system - customize appearance
  theme: ThemeProvider;
  
  // App configuration
  config: AppConfig;
  
  // HTTP client for API calls
  http: HttpClient;
}
```

### 2.3 Plugin Lifecycle

```
Registration → Dependency Resolution → Initialization → Active → Destruction
     ↓                    ↓                   ↓             ↓          ↓
  register()      check dependencies    initialize()   running   destroy()
```

**Events emitted:**
- `plugin:registered` - After registration
- `plugin:initialized` - After successful initialization
- `plugin:destroyed` - After cleanup

---

## 3. Component Plugins

### 3.1 Table Plugin

Create a custom table component plugin:

```typescript
// src/MyTablePlugin.ts
import type { ITablePlugin, TableProps, PluginContext } from '@objectos/web-framework';
import { MyTableComponent } from './components/MyTable';

export class MyTablePlugin implements ITablePlugin {
  name = '@myorg/table-plugin';
  version = '1.0.0';
  category = 'table';
  
  metadata = {
    displayName: 'My Table Plugin',
    description: 'Custom high-performance table',
    author: 'Your Name'
  };
  
  // Declare capabilities
  capabilities = {
    sorting: true,
    filtering: true,
    grouping: false,
    virtualization: true,
    export: true,
    cellEditing: true
  };
  
  private context!: PluginContext;
  
  async initialize(context: PluginContext) {
    this.context = context;
    
    // Register the table component
    context.components.register('table', MyTableComponent);
    
    // Listen to events
    context.events.on('data:fetched', this.onDataFetched);
    
    // Register custom events
    context.events.register('table:sorted');
    context.events.register('table:filtered');
  }
  
  renderTable(props: TableProps) {
    return <MyTableComponent {...props} />;
  }
  
  private onDataFetched = (data: any) => {
    console.log('Table plugin received data:', data.length, 'rows');
  };
  
  async destroy() {
    this.context.events.off('data:fetched', this.onDataFetched);
  }
}
```

**Table Component Implementation:**

```typescript
// src/components/MyTable.tsx
import React, { useMemo } from 'react';
import type { TableProps } from '@objectos/web-framework';

export function MyTableComponent(props: TableProps) {
  const { data, columns, onRowClick, onSort, sorting } = props;
  
  const sortedData = useMemo(() => {
    if (!sorting) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sorting.field];
      const bVal = b[sorting.field];
      const order = sorting.order === 'asc' ? 1 : -1;
      
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });
  }, [data, sorting]);
  
  const handleHeaderClick = (field: string) => {
    const newOrder = sorting?.field === field && sorting.order === 'asc' 
      ? 'desc' 
      : 'asc';
    onSort?.({ field, order: newOrder });
  };
  
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map(col => (
              <th 
                key={col.id}
                onClick={() => handleHeaderClick(col.field)}
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
              >
                {col.label}
                {sorting?.field === col.field && (
                  <span className="ml-2">
                    {sorting.order === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr 
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              {columns.map(col => (
                <td key={col.id} className="px-4 py-2">
                  {row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3.2 Form Plugin

Create a custom form component plugin:

```typescript
// src/MyFormPlugin.ts
import type { IFormPlugin, FormProps, PluginContext } from '@objectos/web-framework';
import { MyFormComponent } from './components/MyForm';

export class MyFormPlugin implements IFormPlugin {
  name = '@myorg/form-plugin';
  version = '1.0.0';
  category = 'form';
  
  metadata = {
    displayName: 'My Form Plugin',
    description: 'Custom form with advanced validation',
    author: 'Your Name'
  };
  
  capabilities = {
    validation: true,
    conditionalFields: true,
    fileUpload: true,
    autoSave: false,
    multiStep: false
  };
  
  async initialize(context: PluginContext) {
    context.components.register('form', MyFormComponent);
  }
  
  renderForm(props: FormProps) {
    return <MyFormComponent {...props} />;
  }
  
  // Optional: Custom validator
  createValidator(schema: any) {
    return (values: any) => {
      const errors: Record<string, string> = {};
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = values[field];
        const fieldRules = rules as any;
        
        if (fieldRules.required && !value) {
          errors[field] = 'This field is required';
        }
        
        if (fieldRules.minLength && value?.length < fieldRules.minLength) {
          errors[field] = `Minimum length is ${fieldRules.minLength}`;
        }
      }
      
      return errors;
    };
  }
}
```

### 3.3 Chart Plugin

Create a custom chart plugin:

```typescript
// src/MyChartPlugin.ts
import type { IChartPlugin, ChartProps, PluginContext } from '@objectos/web-framework';
import { MyChartComponent } from './components/MyChart';

export class MyChartPlugin implements IChartPlugin {
  name = '@myorg/chart-plugin';
  version = '1.0.0';
  category = 'chart';
  
  metadata = {
    displayName: 'My Chart Plugin',
    description: 'Beautiful interactive charts',
    author: 'Your Name'
  };
  
  // Supported chart types
  chartTypes = ['bar', 'line', 'pie', 'area', 'scatter'];
  
  capabilities = {
    interactive: true,
    realtime: false,
    export: true,
    animations: true
  };
  
  async initialize(context: PluginContext) {
    // Register chart component
    context.components.register('chart', MyChartComponent);
    
    // Register individual chart type components
    context.components.register('chart.bar', MyBarChart);
    context.components.register('chart.line', MyLineChart);
    context.components.register('chart.pie', MyPieChart);
  }
  
  renderChart(props: ChartProps) {
    return <MyChartComponent {...props} />;
  }
}
```

### 3.4 Extending Existing Plugins

Wrap and enhance an existing plugin:

```typescript
// src/EnhancedTablePlugin.ts
import type { ITablePlugin, PluginContext } from '@objectos/web-framework';

export class EnhancedTablePlugin implements ITablePlugin {
  name = '@myorg/enhanced-table';
  version = '1.0.0';
  category = 'table';
  
  // Depend on base table plugin
  dependencies = ['@objectos/plugin-table-default'];
  
  metadata = {
    displayName: 'Enhanced Table',
    description: 'Adds analytics to default table'
  };
  
  async initialize(context: PluginContext) {
    // Get the existing table component
    const BaseTable = context.components.get('table');
    
    // Create enhanced wrapper
    const EnhancedTable = (props: any) => {
      // Track table interactions
      const handleRowClick = (row: any) => {
        context.events.emit('analytics:track', {
          event: 'table_row_clicked',
          data: { id: row.id }
        });
        props.onRowClick?.(row);
      };
      
      return (
        <BaseTable 
          {...props} 
          onRowClick={handleRowClick}
        />
      );
    };
    
    // Register enhanced version
    context.components.register('table', EnhancedTable);
  }
  
  renderTable(props: any) {
    const TableComponent = this.context.components.get('table');
    return <TableComponent {...props} />;
  }
}
```

---

## 4. Publishing Plugins

### 4.1 Package Configuration

```json
// package.json
{
  "name": "@myorg/objectos-plugin-name",
  "version": "1.0.0",
  "description": "My awesome ObjectOS plugin",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "objectos",
    "objectos-plugin",
    "table",
    "react"
  ],
  "peerDependencies": {
    "@objectos/web-framework": "^0.1.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@objectos/web-framework": "^0.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/myorg/my-plugin"
  },
  "author": "Your Name",
  "license": "MIT"
}
```

### 4.2 Build Configuration

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@objectos/web-framework'
  ],
  sourcemap: true,
  minify: false
});
```

### 4.3 Publishing to npm

```bash
# Build the plugin
pnpm build

# Test the package locally
pnpm pack

# Login to npm (if not already)
npm login

# Publish to npm
npm publish --access public

# Or publish a beta version
npm publish --tag beta
```

### 4.4 Submitting to ObjectOS Marketplace

To make your plugin discoverable in the ObjectOS marketplace:

**Step 1: Prepare Your Plugin**

Ensure you have:
- ✅ `plugin.manifest.json` with complete metadata
- ✅ README.md with clear documentation
- ✅ LICENSE file
- ✅ CHANGELOG.md
- ✅ High-quality icon and screenshots
- ✅ Published to npm registry

**Step 2: Submit to Marketplace**

```bash
# Install ObjectOS CLI
npm install -g @objectos/cli

# Login to marketplace
objectos login

# Submit your plugin
objectos plugin submit @myorg/objectos-plugin-name

# This will:
# 1. Validate plugin.manifest.json
# 2. Check npm package exists
# 3. Scan for security issues
# 4. Submit for review (if commercial)
# 5. Publish to marketplace (if approved)
```

**Step 3: Marketplace Review Process**

For **free plugins**:
- Automated security scan
- Validation of manifest
- Immediate publication if checks pass

For **commercial plugins**:
- All free plugin checks
- Manual review by ObjectOS team (1-3 business days)
- License verification setup
- Payment integration (if applicable)

### 4.5 Commercial Plugin Distribution

#### Setting Up Commercial Licensing

**1. Configure Pricing in Manifest:**

```json
{
  "metadata": {
    "license": "Commercial",
    "pricing": {
      "type": "subscription",
      "price": 29.99,
      "currency": "USD",
      "trialDays": 14
    }
  }
}
```

**2. Implement License Verification:**

```typescript
export class CommercialPlugin implements ITablePlugin {
  async initialize(context: PluginContext) {
    // Verify license on initialization
    const isValid = await this.verifyLicense(context);
    
    if (!isValid) {
      // Show license purchase UI
      this.showLicenseRequired(context);
      return;
    }
    
    // Continue with normal initialization
    this.initializeFeatures(context);
  }
  
  private async verifyLicense(context: PluginContext): Promise<boolean> {
    const licenseKey = context.config.get(`plugins.licenses.${this.name}`);
    
    if (!licenseKey) {
      return false;
    }
    
    // Verify with marketplace API
    const response = await fetch('https://marketplace.objectos.org/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plugin: this.name,
        version: this.version,
        licenseKey: licenseKey,
        instanceId: context.config.get('instanceId')
      })
    });
    
    const result = await response.json();
    return result.valid && !result.expired;
  }
  
  private showLicenseRequired(context: PluginContext) {
    context.events.emit('plugin:license-required', {
      plugin: this.name,
      purchaseUrl: `https://marketplace.objectos.org/plugins/${this.name}/purchase`
    });
  }
}
```

**3. Handle Trial Period:**

```typescript
private async checkTrialStatus(context: PluginContext): Promise<{
  isTrial: boolean;
  daysRemaining: number;
  expired: boolean;
}> {
  const installDate = context.config.get(`plugins.installed.${this.name}`);
  
  if (!installDate) {
    // First install, set install date
    const now = new Date().toISOString();
    await context.config.set(`plugins.installed.${this.name}`, now);
    
    return {
      isTrial: true,
      daysRemaining: this.metadata.pricing.trialDays || 0,
      expired: false
    };
  }
  
  const installed = new Date(installDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - installed.getTime()) / (1000 * 60 * 60 * 24));
  const trialDays = this.metadata.pricing.trialDays || 0;
  
  return {
    isTrial: true,
    daysRemaining: Math.max(0, trialDays - daysPassed),
    expired: daysPassed >= trialDays
  };
}
```

#### Revenue Sharing

ObjectOS marketplace uses the following revenue share model:

- **Free plugins**: No fees
- **Paid plugins**: 20% marketplace fee
- **Your revenue**: 80% of sale price

Payment processing:
- Monthly payouts via Stripe
- Minimum payout: $100
- Automatic tax documentation (W-9/W-8)

### 4.6 Documentation Requirements

Every plugin MUST include:

1. **README.md** with:
   - Installation instructions
   - Basic usage example
   - Configuration options
   - API documentation
   - Contributing guide
   - License information
   
2. **CHANGELOG.md** tracking version history

3. **LICENSE** file (MIT recommended for free, Commercial for paid)

4. **TypeScript definitions** (`.d.ts` files)

5. **plugin.manifest.json** with complete metadata

---

## 5. Best Practices

### 5.1 Naming Conventions

- **Plugin Name**: `@vendor/objectos-plugin-category`
  - Example: `@acme/objectos-plugin-table-advanced`
  
- **Component Names**: PascalCase
  - Example: `MyTableComponent`
  
- **Event Names**: `category:action`
  - Example: `table:sorted`, `form:validated`

### 5.2 Performance

**Do's:**
- Use React.memo for expensive components
- Implement virtualization for large datasets
- Lazy load heavy dependencies
- Debounce event handlers
- Use useMemo/useCallback hooks

**Don'ts:**
- Don't bundle React (use peerDependencies)
- Don't perform heavy computations in render
- Don't create new objects in render methods
- Don't forget to cleanup event listeners

### 5.3 Error Handling

Always handle errors gracefully:

```typescript
async initialize(context: PluginContext) {
  try {
    // Plugin initialization
    await this.setupPlugin(context);
  } catch (error) {
    console.error(`Failed to initialize ${this.name}:`, error);
    
    // Emit error event
    context.events.emit('plugin:error', {
      plugin: this.name,
      error
    });
    
    // Optionally: attempt graceful degradation
    this.initializeFallback(context);
  }
}
```

### 5.4 TypeScript

Use strict TypeScript:

```typescript
// Enable strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

Export types for consumers:

```typescript
// src/types.ts
export interface MyTableOptions {
  pageSize?: number;
  virtualized?: boolean;
  exportEnabled?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}
```

### 5.5 Accessibility

Ensure components are accessible:

```typescript
<table role="table" aria-label="Data table">
  <thead>
    <tr role="row">
      <th 
        role="columnheader"
        aria-sort={sortDirection}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {column.label}
      </th>
    </tr>
  </thead>
</table>
```

### 5.6 Internationalization

Support i18n from the start:

```typescript
async initialize(context: PluginContext) {
  // Register translations
  context.i18n.register('en', {
    'table.noData': 'No data available',
    'table.loading': 'Loading...',
    'table.error': 'Error loading data'
  });
  
  context.i18n.register('zh', {
    'table.noData': '暂无数据',
    'table.loading': '加载中...',
    'table.error': '加载数据出错'
  });
}
```

---

## 6. Testing

### 6.1 Unit Tests

```typescript
// __tests__/MyTablePlugin.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createTestFramework } from '@objectos/web-framework/testing';
import { MyTablePlugin } from '../src';

describe('MyTablePlugin', () => {
  it('should register successfully', async () => {
    const framework = createTestFramework();
    const plugin = new MyTablePlugin();
    
    await framework.registerPlugin(plugin);
    
    expect(framework.hasPlugin('@myorg/table-plugin')).toBe(true);
  });
  
  it('should register table component', async () => {
    const framework = createTestFramework();
    const plugin = new MyTablePlugin();
    
    await framework.registerPlugin(plugin);
    
    const TableComponent = framework.components.get('table');
    expect(TableComponent).toBeDefined();
  });
  
  it('should emit events on data fetch', async () => {
    const framework = createTestFramework();
    const plugin = new MyTablePlugin();
    const handler = vi.fn();
    
    await framework.registerPlugin(plugin);
    framework.events.on('data:fetched', handler);
    
    framework.events.emit('data:fetched', { data: [] });
    
    expect(handler).toHaveBeenCalled();
  });
});
```

### 6.2 Component Tests

```typescript
// __tests__/MyTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyTableComponent } from '../src/components/MyTable';

describe('MyTableComponent', () => {
  const mockData = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 }
  ];
  
  const mockColumns = [
    { id: 'name', field: 'name', label: 'Name' },
    { id: 'age', field: 'age', label: 'Age' }
  ];
  
  it('renders table with data', () => {
    render(
      <MyTableComponent 
        data={mockData} 
        columns={mockColumns} 
      />
    );
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
  
  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn();
    
    render(
      <MyTableComponent 
        data={mockData} 
        columns={mockColumns}
        onRowClick={handleRowClick}
      />
    );
    
    fireEvent.click(screen.getByText('Alice'));
    
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });
  
  it('sorts data when header is clicked', () => {
    const handleSort = vi.fn();
    
    render(
      <MyTableComponent 
        data={mockData} 
        columns={mockColumns}
        onSort={handleSort}
      />
    );
    
    fireEvent.click(screen.getByText('Age'));
    
    expect(handleSort).toHaveBeenCalledWith({
      field: 'age',
      order: 'asc'
    });
  });
});
```

### 6.3 Integration Tests

```typescript
// __tests__/integration.test.tsx
import { render, screen } from '@testing-library/react';
import { createFramework, FrameworkProvider } from '@objectos/web-framework';
import { MyTablePlugin } from '../src';

describe('Plugin Integration', () => {
  it('works in framework context', () => {
    const framework = createFramework({
      plugins: [new MyTablePlugin()]
    });
    
    function App() {
      const Table = framework.components.get('table');
      
      return (
        <FrameworkProvider framework={framework}>
          <Table 
            data={mockData} 
            columns={mockColumns} 
          />
        </FrameworkProvider>
      );
    }
    
    render(<App />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
```

---

## 7. Examples

### 7.1 Minimal Plugin

The simplest possible plugin:

```typescript
import type { IObjectOSPlugin, PluginContext } from '@objectos/web-framework';

export class HelloPlugin implements IObjectOSPlugin {
  name = '@example/hello-plugin';
  version = '1.0.0';
  
  metadata = {
    displayName: 'Hello Plugin',
    description: 'Says hello'
  };
  
  async initialize(context: PluginContext) {
    console.log('Hello from plugin!');
    
    context.events.on('app:ready', () => {
      console.log('App is ready!');
    });
  }
}
```

### 7.2 Analytics Plugin

Track user interactions:

```typescript
import type { IObjectOSPlugin, PluginContext } from '@objectos/web-framework';

export class AnalyticsPlugin implements IObjectOSPlugin {
  name = '@example/analytics-plugin';
  version = '1.0.0';
  
  metadata = {
    displayName: 'Analytics Plugin',
    description: 'Tracks user interactions'
  };
  
  private analyticsId: string;
  
  constructor(config: { analyticsId: string }) {
    this.analyticsId = config.analyticsId;
  }
  
  async initialize(context: PluginContext) {
    // Track page views
    context.events.on('view:changed', (payload) => {
      this.track('page_view', {
        path: payload.path,
        title: payload.title
      });
    });
    
    // Track form submissions
    context.events.on('form:submitted', (payload) => {
      this.track('form_submit', {
        formId: payload.formId
      });
    });
    
    // Track data operations
    context.events.on('data:created', (payload) => {
      this.track('record_created', {
        object: payload.objectName
      });
    });
  }
  
  private track(event: string, data: any) {
    // Send to analytics service
    fetch(`https://analytics.example.com/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        analyticsId: this.analyticsId,
        timestamp: Date.now()
      })
    }).catch(console.error);
  }
}

// Usage:
const framework = createFramework({
  plugins: [
    new AnalyticsPlugin({ analyticsId: 'UA-XXXXX' })
  ]
});
```

### 7.3 Theme Plugin

Custom theme provider:

```typescript
import type { IObjectOSPlugin, PluginContext } from '@objectos/web-framework';

export class DarkThemePlugin implements IObjectOSPlugin {
  name = '@example/dark-theme';
  version = '1.0.0';
  
  metadata = {
    displayName: 'Dark Theme',
    description: 'Modern dark theme'
  };
  
  async initialize(context: PluginContext) {
    context.theme.register('dark', {
      colors: {
        primary: '#3B82F6',
        background: '#1F2937',
        foreground: '#F9FAFB',
        border: '#374151',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem'
      }
    });
    
    // Auto-apply based on system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      context.theme.setActive('dark');
    }
  }
}
```

### 7.4 Export Plugin

Add export functionality:

```typescript
import type { IObjectOSPlugin, PluginContext } from '@objectos/web-framework';

export class ExportPlugin implements IObjectOSPlugin {
  name = '@example/export-plugin';
  version = '1.0.0';
  
  metadata = {
    displayName: 'Export Plugin',
    description: 'Export data to CSV, Excel, PDF'
  };
  
  async initialize(context: PluginContext) {
    // Listen for export requests
    context.events.on('table:export', async (payload) => {
      const { data, format } = payload;
      
      switch (format) {
        case 'csv':
          this.exportCSV(data);
          break;
        case 'excel':
          await this.exportExcel(data);
          break;
        case 'pdf':
          await this.exportPDF(data);
          break;
      }
    });
  }
  
  private exportCSV(data: any[]) {
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${Date.now()}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
  
  private async exportExcel(data: any[]) {
    // Use library like xlsx
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `export-${Date.now()}.xlsx`);
  }
  
  private async exportPDF(data: any[]) {
    // Use library like jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add content
    doc.text('Data Export', 10, 10);
    // ... format data for PDF
    
    doc.save(`export-${Date.now()}.pdf`);
  }
}
```

---

## Resources

- **Plugin Template**: https://github.com/objectql/plugin-template
- **Plugin Registry**: https://plugins.objectos.org
- **API Documentation**: https://docs.objectos.org/api
- **Community Discord**: https://discord.gg/objectos
- **GitHub Discussions**: https://github.com/objectql/objectos/discussions

---

## Getting Help

- **Documentation**: Start with the [Web Framework Specification](./web-framework.md)
- **Examples**: Check the [official plugins repository](https://github.com/objectql/plugins)
- **Community**: Join our [Discord server](https://discord.gg/objectos)
- **Issues**: Report bugs on [GitHub](https://github.com/objectql/objectos/issues)

---

**Happy Plugin Development! 🚀**
