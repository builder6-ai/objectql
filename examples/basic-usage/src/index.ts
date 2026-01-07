import { ObjectQL, ObjectConfig, UnifiedQuery } from '@objectql/core';
import { MongoDriver } from '@objectql/driver-mongo';
// import { MockDriver } from './mock-driver';

const projectObj: ObjectConfig = {
  name: 'projects',
  label: 'Project',
  fields: {
    name: { type: 'text', required: true, label: 'Name' },
    status: {
      type: 'select',
      options: ['planned', 'in_progress', 'completed'],
      defaultValue: 'planned'
    },
    priority: {
      type: 'select',
      options: ['low', 'normal', 'high'],
      defaultValue: 'normal'
    },
    description: { type: 'textarea' },
    owner: { type: 'text' }
  },
  listeners: {
      beforeFind: async (context) => {
          // Row Level Security: simple filter by owner if not system
          if (!context.ctx.isSystem && context.ctx.userId) {
              console.log(`[Hook] Restricting access for user: ${context.ctx.userId}`);
              context.utils.restrict(['owner', '=', context.ctx.userId]);
          }
      },
      beforeCreate: async (context) => {
          if (context.doc) {
              // Auto-assign owner if missing
              if (!context.doc.owner && context.ctx.userId) {
                  context.doc.owner = context.ctx.userId;
              }
          }
      }
  }
};

const taskObj: ObjectConfig = {
  name: 'tasks',
  label: 'Task',
  fields: {
    name: { type: 'text', required: true },
    project: { type: 'lookup', reference_to: 'projects' },
    due_date: { type: 'date' },
    completed: { type: 'boolean', defaultValue: false }
  }
};

const app = new ObjectQL({
  objects: {
    projects: projectObj,
    tasks: taskObj
  },
  datasources: {
    default: new MongoDriver({ 
        url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/objectql_example',
        dbName: 'objectql_example'
    }),
    // default: new MockDriver()
  }
});

// Example: Find orders with amount > 1000 and expand customer details
const query: UnifiedQuery = {
  fields: ['name', 'status', 'priority'],
  filters: [
    ['status', '=', 'in_progress'],
    'and',
    ['priority', '=', 'high']
  ],
  sort: [['name', 'desc']],
  expand: {
    tasks: {
      fields: ['name', 'due_date']
    }
  }
};


(async () => {
    // 1. Create some dummy data (System context to bypass hooks/setup data)
    const systemCtx = app.createContext({ isSystem: true });
    // User 123's project
    await systemCtx.object('projects').create({
        name: 'Website Redesign',
        status: 'in_progress',
        priority: 'high',
        owner: 'u-123'
    });
    // Another user's project
    await systemCtx.object('projects').create({
        name: 'Mobile App',
        status: 'planned',
        priority: 'high',
        owner: 'u-999'
    });

    // 2. Query as u-123
    console.log('\n--- Querying as user u-123 ---');
    const ctx = app.createContext({
      userId: 'u-123'
    });
    // The query itself doesn't have an owner filter, but the Hook will inject it.
    const resultsMongo = await ctx.object('projects').find(query);
    console.log('Query Results (Should only see Website Redesign):', JSON.stringify(resultsMongo, null, 2));
    
    // 3. Query as System (Bypass RLS)
    console.log('\n--- Querying as System (Admin) ---');
    const allResults = await systemCtx.object('projects').find({ fields: ['name', 'owner'] });
    console.log('System Results (Should see all):', JSON.stringify(allResults, null, 2));

})();
