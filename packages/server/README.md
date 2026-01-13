# @objectos/server

The Gateway - NestJS HTTP server for ObjectOS applications.

## Overview

`@objectos/server` is a production-ready NestJS application that exposes ObjectOS functionality via HTTP APIs. It implements the **"Server handles HTTP"** principle from the ObjectOS architecture.

## Architecture

Following the ObjectOS Architecture Guidelines:

- **Rule #1 (Dependency Wall)**: Controllers call Kernel methods, never ObjectQL directly
- **Rule #2 (Security Wrapper Pattern)**: All requests go through authentication middleware
- **Rule #3 (NestJS Native DI)**: Strictly uses dependency injection throughout
- **Rule #4 (Headless Principle)**: Serves metadata-rich APIs, never generates UI code

## Features

- **REST API**: Standard CRUD operations at `/api/data/*`
- **Metadata API**: Schema information at `/api/metadata/*`
- **JSON-RPC API**: Advanced queries at `/api/objectql`
- **Authentication**: Better-Auth integration with JWT tokens
- **Static Serving**: Serves React frontend from `@objectos/web`
- **Multi-tenancy**: Organization/workspace support via spaceId

## Installation

```bash
npm install @objectos/server
```

## Quick Start

### Development Mode

```bash
# Install dependencies
pnpm install

# Start development server (with hot reload)
pnpm run dev
```

The server will start at `http://localhost:3000`.

### Production Mode

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

## Configuration

Create `objectql.config.ts` in the project root:

```typescript
// objectql.config.ts
export default {
  datasource: {
    default: {
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://localhost/myapp'
    }
  },
  presets: [
    '@objectos/preset-base' // System objects: User, Role, Permission
  ]
};
```

### Supported Database Types

#### PostgreSQL

```typescript
datasource: {
  default: {
    type: 'postgres',
    url: 'postgresql://user:password@localhost:5432/database'
  }
}
```

#### SQLite

```typescript
datasource: {
  default: {
    type: 'sqlite',
    filename: './data.db' // or ':memory:' for in-memory
  }
}
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://localhost/myapp

# Server
PORT=3000
NODE_ENV=production

# Auth (Better-Auth)
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

## API Reference

### REST API (`/api/data`)

Standard CRUD operations on objects.

#### Create Record

```http
POST /api/data/:objectName
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

#### Query Records

```http
GET /api/data/:objectName?filters=...&sort=...&limit=10
```

Query parameters can also be sent via POST body for complex queries.

#### Get Single Record

```http
GET /api/data/:objectName/:id
```

#### Update Record

```http
PATCH /api/data/:objectName/:id
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

#### Delete Record

```http
DELETE /api/data/:objectName/:id
```

### Metadata API (`/api/metadata`)

Retrieve schema information for objects and apps.

#### List All Objects

```http
GET /api/metadata/objects
```

Response:
```json
[
  {
    "name": "contacts",
    "label": "Contact",
    "icon": "ri-user-line",
    "fields": { ... }
  }
]
```

#### Get Object Schema

```http
GET /api/metadata/objects/:objectName
```

#### List All Apps

```http
GET /api/metadata/apps
```

### JSON-RPC API (`/api/objectql`)

Advanced query operations using JSON-RPC protocol.

```http
POST /api/objectql
Content-Type: application/json

{
  "op": "find",
  "object": "contacts",
  "args": {
    "filters": [
      { "field": "status", "operator": "equals", "value": "active" }
    ],
    "sort": [
      { "field": "created_at", "order": "desc" }
    ],
    "limit": 10
  }
}
```

Supported operations:
- `find` - Query records
- `findOne` - Get single record
- `insert` - Create record
- `update` - Update record
- `delete` - Delete record
- `count` - Count records
- `aggregate` - Aggregation queries

### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok"
}
```

## Authentication

The server uses Better-Auth for authentication. All `/api/*` routes pass through the authentication middleware.

### User Context

Authenticated requests have access to user context:

```typescript
interface UserContext {
  userId: string;           // Unique user ID
  id: string;              // Alias for userId
  roles: string[];         // User roles (e.g., ['admin', 'user'])
  spaceId?: string;        // Organization/workspace ID (multi-tenancy)
  sessionId?: string;      // Session identifier
  isSystem: boolean;       // System admin flag (bypasses ACL)
}
```

### Development Mode

For testing without authentication, use headers:

```http
GET /api/data/contacts
x-user-id: testuser
x-space-id: org123
```

⚠️ **Warning**: This fallback should be disabled in production.

## Project Structure

```
packages/server/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Health check endpoint
│   ├── objectql/
│   │   ├── objectql.module.ts     # ObjectOS provider module
│   │   └── objectql.provider.ts   # ObjectOS factory
│   └── auth/
│       ├── auth.module.ts         # Authentication module
│       ├── auth.middleware.ts     # JWT validation
│       ├── auth.controller.ts     # Login/logout endpoints
│       └── auth.client.ts         # Better-Auth client
├── nest-cli.json                  # NestJS CLI configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

## Extending the Server

### Adding Custom Controllers

```typescript
// custom.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { ObjectOS } from '@objectos/kernel';

@Controller('api/custom')
export class CustomController {
  constructor(
    @Inject(ObjectOS) private readonly os: ObjectOS
  ) {}

  @Get('stats')
  async getStats() {
    const userCount = await this.os.count('users', {});
    const contactCount = await this.os.count('contacts', {});
    
    return {
      users: userCount,
      contacts: contactCount
    };
  }
}
```

Register in `app.module.ts`:

```typescript
@Module({
  controllers: [AppController, CustomController],
  // ...
})
export class AppModule {}
```

### Adding Custom Middleware

```typescript
// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.url}`);
    next();
  }
}
```

Apply in `app.module.ts`:

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
```

## Testing

### Unit Tests

```bash
pnpm run test
```

### E2E Tests

```bash
pnpm run test:e2e
```

Example E2E test:

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Deployment

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t objectos-server .
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... objectos-server
```

### Environment-Specific Configuration

```typescript
// objectql.config.ts
const config = {
  development: {
    datasource: {
      default: {
        type: 'sqlite',
        filename: './dev.db'
      }
    }
  },
  production: {
    datasource: {
      default: {
        type: 'postgres',
        url: process.env.DATABASE_URL
      }
    }
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## Best Practices

### 1. Use Dependency Injection

Always inject ObjectOS via constructor:

```typescript
// ✅ GOOD
constructor(@Inject(ObjectOS) private readonly os: ObjectOS) {}

// ❌ BAD
const os = new ObjectOS();
```

### 2. Never Bypass the Kernel

Controllers must call kernel methods, not ObjectQL directly:

```typescript
// ✅ GOOD
const data = await this.os.find('contacts', {});

// ❌ BAD
const data = await this.os.datasource('default').find('contacts', {});
```

### 3. Handle Errors Gracefully

```typescript
@Post()
async create(@Body() data: any) {
  try {
    return await this.os.insert('contacts', data);
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      throw new BadRequestException(error.message);
    }
    throw new InternalServerErrorException('Failed to create contact');
  }
}
```

### 4. Use DTOs for Validation

```typescript
// create-contact.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}

// In controller
@Post()
async create(@Body() data: CreateContactDto) {
  return await this.os.insert('contacts', data);
}
```

## Troubleshooting

### Server won't start

1. Check database connection:
   ```bash
   # Test PostgreSQL connection
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. Verify configuration file exists:
   ```bash
   ls objectql.config.ts
   ```

3. Check for port conflicts:
   ```bash
   lsof -i :3000
   ```

### Authentication issues

1. Verify BETTER_AUTH_SECRET is set
2. Check JWT token validity
3. Review auth.middleware.ts logs

### Metadata not loading

1. Ensure preset packages are installed:
   ```bash
   pnpm install @objectos/preset-base
   ```

2. Check metadata file paths in configuration
3. Review server logs for loading errors

## License

[GNU Affero General Public License v3.0 (AGPL-3.0)](../../LICENSE)

## Related Packages

- **[@objectos/kernel](../kernel)** - The ObjectOS runtime engine
- **[@objectos/web](../web)** - React frontend application
- **[@objectos/preset-base](../presets/base)** - System objects preset
- **[@objectql/server](https://github.com/objectql/objectql)** - HTTP adapter handlers
