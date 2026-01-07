import { Driver } from '@objectql/core';
import knex, { Knex } from 'knex';

export class KnexDriver implements Driver {
    private knex: Knex;

    constructor(config: any) {
        this.knex = knex(config);
    }

    private getBuilder(objectName: string, options?: any) {
        let builder = this.knex(objectName);
        if (options?.transaction) {
            builder = builder.transacting(options.transaction);
        }
        return builder;
    }

    private applyFilters(builder: Knex.QueryBuilder, filters: any) {
        if (!filters || filters.length === 0) return;

        // Simple linear parser handling [cond, 'or', cond, 'and', cond]
        // Default join is AND.
        let nextJoin = 'and';

        for (const item of filters) {
             if (typeof item === 'string') {
                 if (item.toLowerCase() === 'or') nextJoin = 'or';
                 else if (item.toLowerCase() === 'and') nextJoin = 'and';
                 continue;
             }

             if (Array.isArray(item)) {
                 const [field, op, value] = item;
                 
                 // Handle specific operators that map to different knex methods
                 const apply = (b: any) => {
                     // b is the builder to apply on (could be root or a where clause)
                     // But here we call directly on builder using 'where' or 'orWhere'
                     
                     // Method selection
                     let method = nextJoin === 'or' ? 'orWhere' : 'where';
                     let methodIn = nextJoin === 'or' ? 'orWhereIn' : 'whereIn';
                     let methodNotIn = nextJoin === 'or' ? 'orWhereNotIn' : 'whereNotIn';

                     switch (op) {
                         case '=': b[method](field, value); break;
                         case '!=': b[method](field, '<>', value); break;
                         case 'in': b[methodIn](field, value); break;
                         case 'nin': b[methodNotIn](field, value); break;
                         case 'contains': b[method](field, 'like', `%${value}%`); break; // Simple LIKE
                         default: b[method](field, op, value);
                     }
                 };

                 apply(builder);
                 
                 // Reset join to 'and' for subsequent terms unless strictly specified?
                 // In SQL `A or B and C` means `A or (B and C)`.
                 // If we chain `.where(A).orWhere(B).where(C)` in Knex:
                 // It produces `... WHERE A OR B AND C`.
                 // So linear application matches SQL precedence usually if implicit validation is ok.
                 // But explicit AND after OR is necessary in our array format.
                 nextJoin = 'and'; 
             }
        }
    }

    async find(objectName: string, query: any, options?: any): Promise<any[]> {
        const builder = this.getBuilder(objectName, options);
        
        if (query.fields) {
            builder.select(query.fields);
        } else {
            builder.select('*');
        }

        if (query.filters) {
            this.applyFilters(builder, query.filters);
        }

        if (query.sort) {
            for (const [field, dir] of query.sort) {
                builder.orderBy(field, dir);
            }
        }

        if (query.skip) builder.offset(query.skip);
        if (query.limit) builder.limit(query.limit);

        return await builder;
    }

    async findOne(objectName: string, id: string | number, query?: any, options?: any) {
        if (id) {
            return await this.getBuilder(objectName, options).where('id', id).first();
        }
        if (query) {
             const results = await this.find(objectName, { ...query, limit: 1 }, options);
             return results[0];
        }
        return null;
    }

    async create(objectName: string, data: any, options?: any) {
        // Knex insert returns Result array (e.g. ids)
        // We want the created document. 
        // Some DBs support .returning('*'), others don't easily.
        // Assuming Postgres/SQLite/Modern MySQL for now support returning.
        const builder = this.getBuilder(objectName, options);
        const result = await builder.insert(data).returning('*'); // This might fail on old MySQL
        return result[0];
    }

    async update(objectName: string, id: string | number, data: any, options?: any) {
        const builder = this.getBuilder(objectName, options);
        await builder.where('id', id).update(data);
        return { id, ...data }; // Return patched data? Or fetch fresh?
    }

    async delete(objectName: string, id: string | number, options?: any) {
        const builder = this.getBuilder(objectName, options);
        return await builder.where('id', id).delete();
    }

    async count(objectName: string, filters: any, options?: any): Promise<number> {
        const builder = this.getBuilder(objectName, options);
        if (filters) {
            this.applyFilters(builder, filters);
        }
        const result = await builder.count<{count: number}[]>('* as count');
        // result is usually [{count: 123}] or similar depending on driver
        if (result && result.length > 0) {
            const row: any = result[0];
            return Number(row.count || row['count(*)']);
        }
        return 0;
    }

    // Transaction Support
    async beginTransaction(): Promise<any> {
        return await this.knex.transaction();
    }

    async commitTransaction(trx: Knex.Transaction): Promise<void> {
        await trx.commit();
    }

    async rollbackTransaction(trx: Knex.Transaction): Promise<void> {
        await trx.rollback();
    }
    
    // Bulk
    async createMany(objectName: string, data: any[], options?: any): Promise<any> {
        const builder = this.getBuilder(objectName, options);
        return await builder.insert(data).returning('*');
    }
    
    async updateMany(objectName: string, filters: any, data: any, options?: any): Promise<any> {
        const builder = this.getBuilder(objectName, options);
        if(filters) this.applyFilters(builder, filters);
        return await builder.update(data);
    }
    
    async deleteMany(objectName: string, filters: any, options?: any): Promise<any> {
        const builder = this.getBuilder(objectName, options);
        if(filters) this.applyFilters(builder, filters);
        return await builder.delete();
    }
}

