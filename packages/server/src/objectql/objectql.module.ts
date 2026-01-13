import { Module, Global } from '@nestjs/common';
import { objectQLProvider } from './objectql.provider.js';

/**
 * ObjectQL Module
 * 
 * Global module that provides the ObjectOS kernel instance to the entire application.
 * 
 * The ObjectOS instance is created by the objectQLProvider factory, which:
 * 1. Loads configuration from objectql.config.ts/js
 * 2. Configures database drivers
 * 3. Initializes metadata registry
 * 4. Loads objects, apps, and data from configured sources
 * 
 * Being a @Global() module, ObjectOS can be injected anywhere in the application
 * without importing this module in each feature module.
 * 
 * Following Rule #3: NestJS Native DI - uses global module pattern
 * 
 * @example
 * // In any controller or service
 * constructor(@Inject(ObjectOS) private readonly os: ObjectOS) {}
 */
@Global()
@Module({
    providers: [objectQLProvider],
    exports: [objectQLProvider]
})
export class ObjectQLModule {}

