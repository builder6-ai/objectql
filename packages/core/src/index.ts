import * as path from 'path';

export * from './metadata';
export * from './types';
export * from './driver';
export * from './repository';
export * from './query';

import { ObjectConfig } from './metadata';
import { ObjectQLContext, ObjectQLContextOptions, IObjectQL, ObjectQLConfig } from './types';
import { ObjectRepository } from './repository';
import { Driver } from './driver';
import { loadObjectConfigs } from './loader';

export class ObjectQL implements IObjectQL {
    private objects: Record<string, ObjectConfig> = {};
    private datasources: Record<string, Driver> = {};
    private packageObjects: Record<string, string[]> = {};

    constructor(config: ObjectQLConfig) {
        this.datasources = config.datasources;
        if (config.objects) {
            for (const [key, obj] of Object.entries(config.objects)) {
                this.registerObject(obj);
            }
        }
        if (config.packages) {
            for (const name of config.packages) {
                try {
                    this.loadFromPackage(name);
                } catch (e) {
                    this.loadFromDirectory(name); // Directory logic doesn't register to a "package name" grouping by default unless we pass it, but legacy handled it as pure dir loading.
                }
            }
        }
    }

    addPackage(name: string) {
        // Clear require cache to ensure fresh load if re-installing
        try {
            const entryPath = require.resolve(name, { paths: [process.cwd()] });
            delete require.cache[entryPath];
        } catch (e) {
            // ignore if not found
        }
        this.loadFromPackage(name);
    }

    removePackage(name: string) {
        const objects = this.packageObjects[name];
        if (objects) {
            for (const objName of objects) {
                delete this.objects[objName];
            }
            delete this.packageObjects[name];
        }
    }

    loadFromPackage(name: string) {
        const entryPath = require.resolve(name, { paths: [process.cwd()] });
        const packageDir = path.dirname(entryPath);
        this.loadFromDirectory(packageDir, name);
    }

    loadFromDirectory(dir: string, packageName?: string) {
        const objects = loadObjectConfigs(dir);
        
        if (packageName) {
            // Initialize or clear package group
            this.packageObjects[packageName] = [];
        }

        for (const obj of Object.values(objects)) {
            this.registerObject(obj);
            if (packageName) {
                this.packageObjects[packageName].push(obj.name);
            }
        }
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
                     // If beginTransaction fails, fail.
                     throw e;
                 }

                 const trxCtx: ObjectQLContext = {
                     ...ctx,
                     transactionHandle: trx,
                     // Nested transaction simply reuses the current one (flat transaction)
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
        this.objects[object.name] = object;
    }

    getObject(name: string): ObjectConfig | undefined {
        return this.objects[name];
    }

    getConfigs(): Record<string, ObjectConfig> {
        return this.objects;
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
        for (const objectName in this.objects) {
            const obj = this.objects[objectName];
            if (obj.data && obj.data.length > 0) {
                console.log(`Initializing data for object ${objectName}...`);
                const repo = ctx.object(objectName);
                for (const record of obj.data) {
                    try {
                        if (record._id) {
                             const existing = await repo.findOne(record._id);
                             if (existing) {
                                 continue;
                             }
                        }
                        await repo.create(record);
                        console.log(`Inserted init data for ${objectName}: ${record._id || 'unknown id'}`);
                    } catch (e) {
                        console.error(`Failed to insert init data for ${objectName}:`, e);
                    }
                }
            }
        }
    }
}
