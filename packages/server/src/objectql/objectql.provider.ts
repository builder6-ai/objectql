import { Provider } from '@nestjs/common';
import { ObjectOS } from '@objectos/kernel';
import { KnexDriver } from '@objectql/driver-sql';
import * as path from 'path';
import * as fs from 'fs';

/**
 * ObjectOS Provider for NestJS
 * 
 * Factory provider that creates and initializes an ObjectOS instance.
 * 
 * Configuration Loading Strategy:
 * 1. Searches for objectql.config.ts or objectql.config.js
 * 2. Checks multiple paths (cwd, parent directories) to handle different execution contexts
 * 3. Falls back to in-memory SQLite if no configuration found
 * 
 * Following Rule #3: NestJS Native DI - uses factory provider pattern
 * Following Rule #1: The Dependency Wall - configures drivers, doesn't implement them
 * 
 * @example
 * // objectql.config.ts
 * export default {
 *   datasource: {
 *     default: {
 *       type: 'postgres',
 *       url: 'postgresql://user:pass@localhost/db'
 *     }
 *   },
 *   presets: ['@objectos/preset-base']
 * };
 */
export const objectQLProvider: Provider = {
    provide: ObjectOS,
    useFactory: async () => {
        let config: any = {};
        
        // Phase 1: Locate Configuration File
        // Try to locate objectql.config.ts or objectql.config.js
        // Check multiple paths to handle different execution contexts:
        // - Direct: when running from project root
        // - Parent: when running from packages/server
        // - Grandparent: when running from nested directory
        
        const candidates = [
            path.resolve(process.cwd(), 'objectql.config.ts'),
            path.resolve(process.cwd(), 'objectql.config.js'),
            path.resolve(process.cwd(), '../objectql.config.ts'),
            path.resolve(process.cwd(), '../objectql.config.js'),
            path.resolve(process.cwd(), '../../objectql.config.ts'),
            path.resolve(process.cwd(), '../../objectql.config.js'),
            // Legacy fallbacks for backward compatibility
            path.resolve(process.cwd(), 'objectos.config.js'),
            path.resolve(process.cwd(), '../objectos.config.js'),
            path.resolve(process.cwd(), '../../objectos.config.js'),
        ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                try {
                    console.log(`[ObjectOS] Loading config from ${candidate}`);
                    const loaded = await import(candidate);
                    config = loaded.default || loaded;
                    break;
                } catch (e) {
                    console.error(`[ObjectOS] Error loading config from ${candidate}:`, e);
                }
            }
        }

        // Phase 2: Configure Datasources
        // Map configuration to driver instances
        const datasources: Record<string, any> = {};
        
        if (config.datasource) {
            for (const [key, ds] of Object.entries(config.datasource)) {
                const datasourceConfig = ds as any;
                
                // PostgreSQL Configuration
                if (datasourceConfig.type === 'postgres') {
                    datasources[key] = new KnexDriver({
                        client: 'pg',
                        connection: datasourceConfig.url
                    });
                } 
                // SQLite Configuration
                else if (datasourceConfig.type === 'sqlite') {
                    datasources[key] = new KnexDriver({
                        client: 'sqlite3',
                        connection: {
                            filename: datasourceConfig.filename
                        },
                        useNullAsDefault: true
                    });
                }
            }
        }

        // Phase 3: Fallback to Default
        // If no datasource configured, use in-memory SQLite for development
        if (Object.keys(datasources).length === 0) {
            console.warn('[ObjectOS] No datasource found in config, using default SQLite connection.');
            datasources.default = new KnexDriver({ 
                client: 'sqlite3',
                connection: {
                    filename: ':memory:'
                },
                useNullAsDefault: true
            });
        }

        // Phase 4: Configure Presets
        // Presets provide system objects (User, Role, Permission, etc.)
        const presets = config.presets || ['@objectos/preset-base'];
        
        // Phase 5: Create and Initialize ObjectOS
        const objectos = new ObjectOS({
            datasources,
            presets
        });
        
        try {
            await objectos.init();
        } catch (error) {
            console.error('[ObjectOS] Failed to initialize ObjectOS:', error);
            if (error instanceof Error && error.message.includes('preset')) {
                console.error(`[ObjectOS] Hint: Ensure preset packages are installed: ${presets.join(', ')}`);
            }
            throw error;
        }
        
        return objectos;
    }
};

export default objectQLProvider;
