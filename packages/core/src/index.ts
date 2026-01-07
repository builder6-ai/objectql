import * as path from 'path';

export * from './metadata';
export * from './types';
export * from './driver';
export * from './repository';
export * from './query';
export * from './registry';
export * from './loader';

import { ObjectConfig } from './metadata';
import { ObjectQLContext, ObjectQLContextOptions, IObjectQL, ObjectQLConfig } from './types';
import { ObjectRepository } from './repository';
import { Driver } from './driver';
import { MetadataLoader } from './loader';
import { MetadataRegistry } from './registry';

export class ObjectQL implements IObjectQL {
    public metadata: MetadataRegistry;
    private loader: MetadataLoader;
    private datasources: Record<string, Driver> = {};

    constructor(config: ObjectQLConfig) {
        this.metadata = new MetadataRegistry();
        this.loader = new MetadataLoader(this.metadata);
        this.datasources = config.datasources;

        if (config.objects) {
            for (const [key, obj] of Object.entries(config.objects)) {
                this.registerObject(obj);
            }
        }
        if (config.packages) {
            for (const name of config.packages) {
                this.addPackage(name);
            }
        }
    }

    addPackage(name: string) {
        this.loader.loadPackage(name);
    }


    removePackage(name: string) {
        this.metadata.unregisterPackage(name);
    }

    loadFromDirectory(dir: string, packageName?: string) {
        this.loader.load(dir, packageName);
    }

    createContext(options: ObjectQLContextOptions): ObjectQLContext {
        const ctx: ObjectQLContext = {
            userId: options.userId,
            spaceId: options.spaceId,
            roles: options.roles || [],
            isSystem: options.isSystem,
            ignoreTriggers: options.ignoreTriggers,
            object: (name: string) => {
                return new ObjectRepository(name, ctx, this);
            },
            transaction: async (callback) => {
                 const driver = this.datasources['default'];
                 if (!driver || !driver.beginTransaction) {
                      return callback(ctx);
                 }

                 let trx: any;
                 try {
                     trx = await driver.beginTransaction();
                 } catch (e) {
                     throw e;
                 }

                 const trxCtx: ObjectQLContext = {
                     ...ctx,
                     transactionHandle: trx,
                     transaction: async (cb) => cb(trxCtx)
                 };

                 try {
                     const result = await callback(trxCtx);
                     if (driver.commitTransaction) await driver.commitTransaction(trx);
                     return result;
                 } catch (error) {
                     if (driver.rollbackTransaction) await driver.rollbackTransaction(trx);
                     throw error;
                 }
            },
            sudo: () => {
                 return this.createContext({ ...options, isSystem: true });
            }
        };
        return ctx;
    }

    registerObject(object: ObjectConfig) {
        // Normalize fields
        if (object.fields) {
            for (const [key, field] of Object.entries(object.fields)) {
                if (!field.name) {
                    field.name = key;
                }
            }
        }
        this.metadata.register('object', {
            type: 'object',
            id: object.name,
            content: object
        });
    }

    getObject(name: string): ObjectConfig | undefined {
        return this.metadata.get<ObjectConfig>('object', name);
    }

    getConfigs(): Record<string, ObjectConfig> {
        const result: Record<string, ObjectConfig> = {};
        const objects = this.metadata.list<ObjectConfig>('object');
        for (const obj of objects) {
            result[obj.name] = obj;
        }
        return result;
    }

    datasource(name: string): Driver {
        const driver = this.datasources[name];
        if (!driver) {
            throw new Error(`Datasource '${name}' not found`);
        }
        return driver;
    }

    async init() {
        const ctx = this.createContext({ isSystem: true });
        const objects = this.metadata.list<ObjectConfig>('object');
        for (const obj of objects) {
            if (obj.data && obj.data.length > 0) {
                console.log(`Initializing data for object ${obj.name}...`);
                const repo = ctx.object(obj.name);
                for (const record of obj.data) {
                    try {
                        if (record._id) {
                             const existing = await repo.findOne(record._id);
                             if (existing) {
                                 continue;
                             }
                        }
                        await repo.create(record);
                        console.log(`Inserted init data for ${obj.name}: ${record._id || 'unknown id'}`);
                    } catch (e) {
                        console.error(`Failed to insert init data for ${obj.name}:`, e);
                    }
                }
            }
        }
    }
}
