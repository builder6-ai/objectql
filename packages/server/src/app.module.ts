import { Module, MiddlewareConsumer, RequestMethod, NestModule, Inject } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ObjectQLModule } from './objectql/objectql.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve, dirname } from 'path';
import { AuthMiddleware } from './auth/auth.middleware.js';
import { ObjectOS } from '@objectos/kernel';
import { createRESTHandler, createMetadataHandler, createNodeHandler, createStudioHandler } from '@objectql/server';

// Resolve the path to the built web client
// This allows serving the React frontend from the NestJS server
const clientDistPath = resolve(dirname(require.resolve('@objectos/web/package.json')), 'dist');

/**
 * Application Root Module
 * 
 * Configures the NestJS application with:
 * - ObjectQLModule: Provides ObjectOS kernel instance
 * - AuthModule: Handles authentication with Better-Auth
 * - ServeStaticModule: Serves the React frontend from @objectos/web
 * 
 * Implements middleware to expose ObjectQL server handlers:
 * - REST API: /api/data/* - Standard CRUD operations
 * - Metadata API: /api/metadata/* - Object and app metadata
 * - JSON-RPC: /api/objectql - Advanced query operations
 * 
 * Following Rule #3: NestJS Native DI - uses module system and dependency injection
 * Following Rule #1: The Dependency Wall - server handles HTTP, kernel handles logic
 */
@Module({
  imports: [
    ObjectQLModule, 
    AuthModule,
    // Serve React frontend, excluding API routes
    ServeStaticModule.forRoot({
      rootPath: clientDistPath,
      exclude: ['/api/(.*)'], // API routes handled by controllers/middleware
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(@Inject(ObjectOS) private objectos: ObjectOS) {}

  /**
   * Configure middleware for the application.
   * 
   * Sets up request handlers from @objectql/server package:
   * 
   * 1. **Authentication Middleware**: Validates JWT tokens on all /api/* routes
   * 2. **REST Handler**: CRUD operations at /api/data/:object
   * 3. **Metadata Handler**: Schema information at /api/metadata/:type
   * 4. **JSON-RPC Handler**: Advanced queries at /api/objectql
   * 
   * URL Handling Strategy:
   * - REST and Metadata handlers expect full URLs (e.g., /api/data/contacts)
   * - JSON-RPC handler expects path to be stripped to /
   * 
   * @param consumer - NestJS middleware consumer
   */
  configure(consumer: MiddlewareConsumer) {
    // Create handlers from @objectql/server package
    // These are Express-compatible middleware functions
    const restHandler = createRESTHandler(this.objectos);
    const metadataHandler = createMetadataHandler(this.objectos);
    const objectQLHandler = createNodeHandler(this.objectos);
    const studioHandler = createStudioHandler();

    /**
     * Helper to conditionally strip URL prefix for handlers.
     * 
     * Different handlers have different URL expectations:
     * - REST: Expects /api/data/:object pattern (full path required)
     * - Metadata: Expects /api/metadata/:type pattern (full path required)
     * - JSON-RPC: Expects POST to / with operation in body
     * 
     * @param prefix - The URL prefix to potentially strip
     * @param handler - The Express middleware handler
     * @returns Wrapped middleware function
     */
    const stripPrefix = (prefix: string, handler: any) => {
      return (req: any, res: any, next: any) => {
        // REST API handler needs full path because it matches:
        // /^\/api\/data\/([^\/\?]+)(?:\/([^\/\?]+))?(\?.*)?$/
        if (prefix === '/api/data') {
             return handler(req, res, next);
        }

        // Metadata handler needs full path because it matches:
        // /api/metadata/objects, /api/metadata/apps, etc.
        if (prefix === '/api/metadata') {
             return handler(req, res, next);
        }

        // For JSON-RPC and other handlers, strip the prefix
        // so the handler sees req.url as / instead of /api/objectql
        if (req.originalUrl.startsWith(prefix)) {
             const urlPart = req.originalUrl.substring(prefix.length);
             req.url = urlPart || '/';
             if (req.url.startsWith('?')) {
                 req.url = '/' + req.url;
             }
        }

        // UX Improvement: Friendly message for GET requests to JSON-RPC endpoint
        // JSON-RPC requires POST, but users might navigate to it in browser
        if (prefix === '/api/objectql' && req.method === 'GET' && (req.url === '/' || req.url === '')) {
             res.setHeader('Content-Type', 'application/json');
             res.end(JSON.stringify({
                 code: 'OK',
                 message: 'ObjectOS JSON-RPC Server',
                 hint: 'Use POST request with Body: { op, object, args }'
             }));
             return;
        }

        return handler(req, res, next);
      };
    };

    // Apply authentication middleware to all API routes
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });

    // REST API: CRUD operations
    // POST /api/data/:object - Create record
    // GET /api/data/:object/:id - Get record
    // PATCH /api/data/:object/:id - Update record
    // DELETE /api/data/:object/:id - Delete record
    consumer
      .apply(stripPrefix('/api/data', restHandler))
      .forRoutes({ path: 'api/data*', method: RequestMethod.ALL });

    // Metadata API: Schema information
    // GET /api/metadata/objects - List all objects
    // GET /api/metadata/objects/:name - Get object schema
    // GET /api/metadata/apps - List all apps
    consumer
        .apply(stripPrefix('/api/metadata', metadataHandler))
        .forRoutes({ path: 'api/metadata*', method: RequestMethod.ALL });

    // JSON-RPC API: Advanced query operations
    // POST /api/objectql with body: { op: 'find', object: 'contacts', args: {...} }
    consumer
        .apply(stripPrefix('/api/objectql', objectQLHandler))
        .forRoutes({ path: 'api/objectql*', method: RequestMethod.ALL });
        
  }
}
