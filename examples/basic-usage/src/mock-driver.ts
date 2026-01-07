import { Driver } from '@objectql/core';

export class MockDriver implements Driver {
    private data: Record<string, any[]> = {};
    
    constructor(config: any = {}) {}

    private getData(objectName: string) {
        if (!this.data[objectName]) {
            this.data[objectName] = [];
        }
        return this.data[objectName];
    }

    async find(objectName: string, query: any, options?: any): Promise<any[]> {
        const items = this.getData(objectName);
        if (query.filters) {
            // Very basic filter support: [['field', '=', 'value']]
            return items.filter(item => {
                 // Check logical operator 'and'
                 for (let i = 0; i < query.filters.length; i++) {
                     const f = query.filters[i];
                     if (Array.isArray(f) && f.length === 3) {
                         if (f[1] === '=' && item[f[0]] !== f[2]) return false;
                     }
                 }
                 return true;
            });
        }
        return items;
    }

    async findOne(objectName: string, id: string | number, query?: any, options?: any): Promise<any> {
        const items = this.getData(objectName);
        return items.find((item: any) => item._id === id);
    }

    async create(objectName: string, data: any, options?: any): Promise<any> {
        const items = this.getData(objectName);
        const newItem = {
            ...data,
            _id: data._id || `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        items.push(newItem);
        console.log(`[MockDriver] Inserted into ${objectName}:`, newItem);
        return newItem;
    }

    async update(objectName: string, id: string | number, data: any, options?: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async delete(objectName: string, id: string | number, options?: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
    async count(objectName: string, filters: any, options?: any): Promise<number> {
         return (await this.find(objectName, { filters })).length;
    }
}
