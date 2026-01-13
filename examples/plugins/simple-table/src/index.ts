/**
 * Simple Table Plugin for ObjectOS
 * 
 * This plugin provides a basic table component with sorting and row click handling.
 * It serves as a minimal reference implementation for table plugins.
 */

import type { ITablePlugin, PluginContext, TableProps, PluginMetadata, PluginCapabilities } from '@objectos/web-framework';
import { SimpleTable } from './components/SimpleTable';

export interface SimpleTableConfig {
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export class SimpleTablePlugin implements ITablePlugin {
  name = '@example/simple-table-plugin';
  version = '1.0.0';
  category = 'table';
  
  metadata: PluginMetadata = {
    displayName: 'Simple Table',
    description: 'A minimal table plugin demonstrating basic functionality',
    longDescription: '# Simple Table Plugin\n\nA minimal ObjectOS table plugin that demonstrates the basic plugin architecture.',
    author: 'ObjectOS Team',
    homepage: 'https://github.com/objectql/objectos',
    category: 'table',
    license: 'MIT',
    pricing: {
      type: 'free'
    },
    links: {
      documentation: 'https://docs.objectos.org/plugins/simple-table',
      support: 'https://github.com/objectql/objectos/issues',
      repository: 'https://github.com/objectql/objectos'
    },
    tags: ['table', 'data-grid', 'basic', 'example']
  };
  
  capabilities: PluginCapabilities = {
    provides: {
      components: ['table'],
      services: []
    },
    features: {
      sorting: true,
      filtering: false,
      grouping: false,
      virtualization: false,
      export: false,
      cellEditing: false
    }
  };
  
  private config: SimpleTableConfig;
  private context!: PluginContext;
  
  constructor(config: SimpleTableConfig = {}) {
    this.config = {
      striped: true,
      hoverable: true,
      bordered: false,
      compact: false,
      ...config
    };
  }
  
  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    
    // Register the table component
    context.components.register('table', SimpleTable);
    
    // Listen to data events
    context.events.on('data:fetched', this.handleDataFetched);
    
    // Register custom events
    context.events.register('table:sorted');
    context.events.register('table:row-clicked');
    
    console.log(`[${this.name}] Initialized with config:`, this.config);
  }
  
  renderTable(props: TableProps) {
    return <SimpleTable {...props} config={this.config} />;
  }
  
  private handleDataFetched = (payload: any) => {
    console.log(`[${this.name}] Data fetched:`, payload.data?.length || 0, 'rows');
  };
  
  async destroy(): Promise<void> {
    this.context.events.off('data:fetched', this.handleDataFetched);
    console.log(`[${this.name}] Destroyed`);
  }
}

// Export types
export type { TableProps } from '@objectos/web-framework';
export { SimpleTable } from './components/SimpleTable';
