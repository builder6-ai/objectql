import { ObjectQL } from '@objectql/core';
import { MongoDriver } from '@objectql/driver-mongo';

export const objectql = new ObjectQL({
  datasources: {
      default: new MongoDriver({ 
          url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/objectql_example',
          dbName: 'objectql_example'
      })
  },
  packages: [
      '@example/project-management'
  ]
});
