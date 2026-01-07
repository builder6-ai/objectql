import { MetadataRegistry } from './registry';
import { ObjectConfig } from './types';
import { MetadataLoader as BaseLoader, registerObjectQLPlugins } from '@objectql/metadata';

export class MetadataLoader extends BaseLoader {
    constructor(registry: MetadataRegistry) {
        super(registry);
        registerObjectQLPlugins(this);
    }
}

export function loadObjectConfigs(dir: string): Record<string, ObjectConfig> {
    const registry = new MetadataRegistry();
    const loader = new MetadataLoader(registry);
    loader.load(dir);
    const result: Record<string, ObjectConfig> = {};
    for (const obj of registry.list<ObjectConfig>('object')) {
        result[obj.name] = obj;
    }
    return result;
}

