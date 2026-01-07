import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as glob from 'fast-glob';
import { ObjectQLConfig, ObjectConfig } from './types';

export function loadObjectConfigs(dir: string): Record<string, ObjectConfig> {
    const configs: Record<string, ObjectConfig> = {};
    
    // Convert to absolute path if strictly necessary, but fast-glob handles relative paths too.
    // However, it's safer to work with what we are given or resolve it.
    
    const files = glob.sync(['**/*.object.yml', '**/*.object.yaml'], {
        cwd: dir,
        absolute: true
    });

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const doc = yaml.load(content) as any;
            
            // Handle single object or map of objects if structure varies
            // For now assume each .object.yml describes one object or a map of objects by name
            
            if (doc.name && doc.fields) {
                // Single object definition
                configs[doc.name] = doc as ObjectConfig;
            } else {
                // Check if it's a map of objects
                for (const [key, value] of Object.entries(doc)) {
                    if (typeof value === 'object' && (value as any).fields) {
                         configs[key] = value as ObjectConfig;
                         // Ensure name is set
                         if (!configs[key].name) {
                             configs[key].name = key;
                         }
                    }
                }
            }
        } catch (e) {
            console.error(`Error loading object config from ${file}:`, e);
        }
    }
    
    return configs;
}
