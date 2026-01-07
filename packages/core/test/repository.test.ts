import { ObjectQL } from '../src/index';
import { MockDriver } from './mock-driver';
import { ObjectConfig } from '../src/metadata';

const todoObject: ObjectConfig = {
    name: 'todo',
    fields: {
        title: { type: 'text' },
        completed: { type: 'boolean' },
        owner: { type: 'text' }
    },
    listeners: {}
};

describe('ObjectQL Repository', () => {
    let app: ObjectQL;
    let driver: MockDriver;

    beforeEach(() => {
        driver = new MockDriver();
        app = new ObjectQL({
            datasources: {
                default: driver
            },
            objects: {
                todo: todoObject
            }
        });
        // Reset listeners
        if (todoObject.listeners) {
            todoObject.listeners.beforeCreate = undefined;
            todoObject.listeners.afterCreate = undefined;
        }
    });

    it('should create and retrieve a record', async () => {
        const ctx = app.createContext({ userId: 'u1' });
        const repo = ctx.object('todo');

        const created = await repo.create({ title: 'Buy milk' });
        expect(created.title).toBe('Buy milk');
        expect(created.created_by).toBe('u1');
        expect(created._id).toBeDefined();

        const found = await repo.findOne(created._id);
        expect(found).toMatchObject(created);
    });

    it('should update a record', async () => {
        const ctx = app.createContext({ userId: 'u1' });
        const repo = ctx.object('todo');
        const created = await repo.create({ title: 'Buy milk', completed: false });

        const updated = await repo.update(created._id, { completed: true });
        expect(updated.completed).toBe(true);

        const found = await repo.findOne(created._id);
        expect(found.completed).toBe(true);
    });

    it('should delete a record', async () => {
        const ctx = app.createContext({ userId: 'u1' });
        const repo = ctx.object('todo');
        const created = await repo.create({ title: 'Delete me' });

        await repo.delete(created._id);
        const found = await repo.findOne(created._id);
        expect(found).toBeUndefined();
    });

    it('should support listeners (triggers)', async () => {
        const ctx = app.createContext({ userId: 'u1' });
        const repo = ctx.object('todo');
        
        let beforeCalled = false;
        let afterCalled = false;

        // Register listeners
        todoObject.listeners = {
            beforeCreate: async (context, doc) => {
                beforeCalled = true;
                doc.title = doc.title + ' (checked)';
            },
            afterCreate: async (context, result) => {
                afterCalled = true;
            }
        };

        const created = await repo.create({ title: 'Test hooks' });
        
        expect(beforeCalled).toBe(true);
        expect(afterCalled).toBe(true);
        expect(created.title).toBe('Test hooks (checked)');
    });

    it('should support transactions', async () => {
        const ctx = app.createContext({});
        
        await ctx.transaction(async (trxCtx) => {
             // In a real driver we would check isolation,
             // here we just check that the context has a transaction handle
             expect((trxCtx as any).transactionHandle).toBeDefined();
             const repo = trxCtx.object('todo');
             await repo.create({ title: 'Inside Trx' });
        });
        
        // Data should be persisted (mock driver auto-commits efficiently in memory)
        const found = await ctx.object('todo').find({ filters: [['title', '=', 'Inside Trx']]});
        expect(found).toHaveLength(1);
    });

    it('should auto-populate spaceId', async () => {
        const ctx = app.createContext({ spaceId: 'space-A' });
        const repo = ctx.object('todo');
        
        const created = await repo.create({ title: 'Space test' });
        expect(created.space_id).toBe('space-A');
    });
});
