import { ObjectQL, ObjectConfig } from '@objectql/core';
import { MockDriver } from './mock-driver';

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
    description: { type: 'textarea' }
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
    // default: new MongoDriver({ url: process.env.MONGO_URL }),
    default: new MockDriver()
  }
});

// Example: Find orders with amount > 1000 and expand customer details
const query = {
  entity: 'projects',
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
    // 1. Create some dummy data
    const systemCtx = app.createContext({ isSystem: true });
    await systemCtx.object('projects').create({
        name: 'Website Redesign',
        status: 'in_progress',
        priority: 'high'
    });
    await systemCtx.object('projects').create({
        name: 'Mobile App',
        status: 'planned',
        priority: 'high'
    });

    // 2. Query
    // Option A: Execute on MongoDB
    // ObjectQL compiles this to an Aggregation Pipeline
    const ctx = app.createContext({
      userId: 'u-123'
    });
    const resultsMongo = await ctx.object('projects').find(query);
    console.log('Query Results:', JSON.stringify(resultsMongo, null, 2));
})();
