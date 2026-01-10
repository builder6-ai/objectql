import { ObjectQL } from '@objectql/core';
import { KnexDriver } from '@objectql/driver-knex';

export const objectql = new ObjectQL({
  datasources: {
      default: new KnexDriver({ 
          client: 'sqlite3',
          connection: {
              filename: ':memory:'
          },
          useNullAsDefault: true
      })
  },
  packages: [
      '@objectos/preset-base'
  ]
});
