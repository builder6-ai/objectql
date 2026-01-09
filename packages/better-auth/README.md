# @objectql/better-auth

Better-Auth integration package for ObjectQL, providing multi-tenant organization management capabilities.

## Overview

This package provides object definitions that align with [Better-Auth's](https://better-auth.com) organization plugin schema, enabling multi-tenant organization management in ObjectQL applications.

## Features

### Authentication Objects

- **user** - System users for authentication
- **account** - External authentication accounts (OAuth, GitHub, Google, etc.)
- **session** - User authentication sessions with token management
- **verification** - Email and phone verification tokens

### Organization Management

- **organization** - Multi-tenant organizations with names, slugs, and metadata
- **member** - Organization membership with role-based access control
- **invitation** - Organization invitation system with expiration and status tracking

## Usage

### Server Configuration

The organization plugin is enabled in the server's auth configuration:

```typescript
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { role } from "better-auth/plugins/access";

const auth = betterAuth({
  database: pool,
  plugins: [
    organization({
      // Enable dynamic access control
      dynamicAccessControl: {
        enabled: true
      },
      // Enable teams feature
      teams: {
        enabled: true
      },
      // Define organization roles with permissions
      roles: {
        owner: role({
          organization: ['create', 'read', 'update', 'delete'],
          member: ['create', 'read', 'update', 'delete'],
          invitation: ['create', 'read', 'delete'],
          team: ['create', 'read', 'update', 'delete']
        }),
        admin: role({
          organization: ['read', 'update'],
          member: ['create', 'read', 'update', 'delete'],
          invitation: ['create', 'read', 'delete'],
          team: ['create', 'read', 'update']
        }),
        member: role({
          organization: ['read'],
          member: ['read'],
          team: ['read']
        })
      }
    })
  ]
});
```

### Object Definitions

The package includes YAML object definitions that can be loaded by ObjectQL's metadata loader:

```typescript
import { BetterAuthPackage, getAllObjectDefinitionPaths } from '@objectql/better-auth';

// Get all object definition paths
const objectPaths = getAllObjectDefinitionPaths();
```

## Organization API Endpoints

When the organization plugin is enabled, Better-Auth provides the following endpoints:

### Organization Management

- `POST /api/auth/organization/create` - Create a new organization
- `POST /api/auth/organization/update` - Update organization details
- `DELETE /api/auth/organization/delete` - Delete an organization
- `POST /api/auth/organization/set-active` - Set active organization for session
- `GET /api/auth/organization/get-full` - Get full organization details
- `GET /api/auth/organization/list` - List user's organizations

### Member Management

- `POST /api/auth/organization/add-member` - Add member to organization
- `DELETE /api/auth/organization/remove-member` - Remove member from organization
- `POST /api/auth/organization/update-member-role` - Update member's role
- `GET /api/auth/organization/list-members` - List organization members
- `GET /api/auth/organization/get-active-member` - Get current member details
- `POST /api/auth/organization/leave` - Leave organization

### Invitation Management

- `POST /api/auth/organization/invitation/create` - Create invitation
- `POST /api/auth/organization/invitation/cancel` - Cancel invitation
- `POST /api/auth/organization/invitation/accept` - Accept invitation
- `POST /api/auth/organization/invitation/reject` - Reject invitation
- `GET /api/auth/organization/invitation/get` - Get invitation details
- `GET /api/auth/organization/invitation/list` - List organization invitations

## Roles and Permissions

### Default Roles

The organization plugin supports custom roles with fine-grained permissions:

- **owner** - Full access to all organization features (create, read, update, delete)
- **admin** - Management access for members, invitations, and organization updates
- **member** - Read-only access to organization and members

### Permission Format

Roles are defined using the `role()` function from `better-auth/plugins/access`. Each role specifies which actions are allowed on different resources:

```typescript
import { role } from "better-auth/plugins/access";

const ownerRole = role({
  organization: ['create', 'read', 'update', 'delete'],
  member: ['create', 'read', 'update', 'delete'],
  invitation: ['create', 'read', 'delete'],
  team: ['create', 'read', 'update', 'delete']
});
```

Available resources:
- `organization` - Organization management
- `member` - Member management
- `invitation` - Invitation management
- `team` - Team management (when teams are enabled)

Available actions:
- `create` - Create new resources
- `read` - View resources
- `update` - Modify existing resources
- `delete` - Remove resources

## Schema Reference

### Organization

```yaml
name: organization
fields:
  name: string (required) - Organization name
  slug: string (required, unique) - URL-friendly identifier
  logo: string - Organization logo URL
  metadata: json - Additional metadata
  createdAt: datetime
  updatedAt: datetime
```

### Member

```yaml
name: member
fields:
  organizationId: string (required) - Organization ID
  userId: string (required) - User ID
  role: string (required) - Member role (owner, admin, member)
  createdAt: datetime
  updatedAt: datetime
```

### Invitation

```yaml
name: invitation
fields:
  organizationId: string (required) - Organization ID
  email: string (required) - Invitee email
  role: string (required) - Role to assign
  status: string - Status (pending, accepted, rejected)
  expiresAt: datetime - Expiration time
  inviterId: string (required) - Inviter user ID
  createdAt: datetime
  updatedAt: datetime
```

## Resources

- [Better-Auth Documentation](https://better-auth.com)
- [Better-Auth Organization Plugin](https://better-auth.com/docs/plugins/organization)
- [ObjectQL Documentation](https://github.com/objectql/objectql)

## License

MIT
