import { Provider } from '@nestjs/common';
import { ObjectQL } from '@objectql/core';
import { KnexDriver } from '@objectql/driver-knex';
import * as path from 'path';
import * as fs from 'fs';

export const objectQLProvider: Provider = {
    provide: ObjectQL,
    useFactory: async () => {
        let config: any = {};
        
        // Try to locate objectos.config.js
        // 1. Check process.cwd()
        // 2. Check up to 2 levels up (in case running from packages/server)
        
        const candidates = [
            path.resolve(process.cwd(), 'objectos.config.js'),
            path.resolve(process.cwd(), '../objectos.config.js'),
            path.resolve(process.cwd(), '../../objectos.config.js'),
        ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                try {
                    console.log(`Loading config from ${candidate}`);
                    const loaded = await import(candidate);
                    config = loaded.default || loaded;
                    break;
                } catch (e) {
                    console.error(`Error loading config from ${candidate}:`, e);
                }
            }
        }

        // Map config to ObjectQL options
        const datasources: Record<string, any> = {};
        
        if (config.datasource) {
            for (const [key, ds] of Object.entries(config.datasource)) {
                const datasourceConfig = ds as any;
                if (datasourceConfig.type === 'postgres') {
                    datasources[key] = new KnexDriver({
                        client: 'pg',
                        connection: datasourceConfig.url
                    });
                }
            }
        }

        // Default if no datasource configured
        if (Object.keys(datasources).length === 0) {
            console.warn('No datasource found in config, using default Postgres connection.');
            datasources.default = new KnexDriver({ 
                client: 'pg',
                connection: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/objectql'
            });
        }

        const objectql = new ObjectQL({
            datasources,
            packages: config.presets || ['@objectos/preset-base']
        });
        
        await objectql.init();
        return objectql;
    }
};
