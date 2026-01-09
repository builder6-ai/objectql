# Multi-Tenant Organization Management Implementation

## Overview

This implementation adds multi-tenant organization management capabilities to ObjectQL using the Better-Auth library and its organization plugin, following Better-Auth's official specifications.

## Implementation Details

### 1. Better-Auth Plugin Integration

**File:** `packages/server/src/auth/auth.client.ts`

The organization plugin has been enabled in the Better-Auth configuration with the following features:

- **Dynamic Access Control**: Enabled for fine-grained permission management
- **Teams**: Enabled for sub-organization grouping
- **Role-Based Access Control**: Three default roles configured:
  - `owner`: Full access to all organization features
  - `admin`: Management access for members, invitations, and organization updates
  - `member`: Read-only access to organization and members

### 2. Object Schema Definitions

**Location:** `packages/better-auth/src/*.object.yml`

Seven object schemas are provided, aligned with Better-Auth's database schema:

1. **user.object.yml** - System users with authentication fields
2. **account.object.yml** - External authentication providers (OAuth)
3. **session.object.yml** - User sessions with token management
4. **verification.object.yml** - Email/phone verification tokens
5. **organization.object.yml** - Multi-tenant organizations
6. **member.object.yml** - Organization membership with roles
7. **invitation.object.yml** - Organization invitations with expiration

### 3. Package Exports

**File:** `packages/better-auth/src/index.ts`

The package now exports:
- `BetterAuthPackage` - Package metadata
- `objectDefinitions` - List of all object definition files
- `getObjectDefinitionPath(filename)` - Get path to specific object definition
- `getAllObjectDefinitionPaths()` - Get paths to all object definitions

### 4. API Endpoints

All organization management endpoints are automatically exposed through Better-Auth at `/api/auth/`:

#### Organization Management (10 endpoints)
- `POST /api/auth/organization/create` - Create organization
- `POST /api/auth/organization/update` - Update organization
- `DELETE /api/auth/organization/delete` - Delete organization
- `POST /api/auth/organization/set-active` - Set active organization
- `GET /api/auth/organization/get-full` - Get full organization details
- `GET /api/auth/organization/list` - List user's organizations
- `GET /api/auth/organization/check-slug` - Check slug availability

#### Member Management (8 endpoints)
- `POST /api/auth/organization/add-member` - Add member
- `DELETE /api/auth/organization/remove-member` - Remove member
- `POST /api/auth/organization/update-member-role` - Update member role
- `GET /api/auth/organization/list-members` - List members
- `GET /api/auth/organization/get-active-member` - Get current member
- `GET /api/auth/organization/get-active-member-role` - Get member role
- `POST /api/auth/organization/leave` - Leave organization

#### Invitation Management (7 endpoints)
- `POST /api/auth/organization/invitation/create` - Create invitation
- `POST /api/auth/organization/invitation/cancel` - Cancel invitation
- `POST /api/auth/organization/invitation/accept` - Accept invitation
- `POST /api/auth/organization/invitation/reject` - Reject invitation
- `GET /api/auth/organization/invitation/get` - Get invitation details
- `GET /api/auth/organization/invitation/list` - List organization invitations
- `GET /api/auth/organization/invitation/list-user` - List user invitations

#### Team Management (10 endpoints)
- `POST /api/auth/organization/team/create` - Create team
- `POST /api/auth/organization/team/update` - Update team
- `DELETE /api/auth/organization/team/remove` - Remove team
- `POST /api/auth/organization/team/set-active` - Set active team
- `GET /api/auth/organization/team/list` - List organization teams
- `GET /api/auth/organization/team/list-user` - List user teams
- `GET /api/auth/organization/team/list-members` - List team members
- `POST /api/auth/organization/team/add-member` - Add team member
- `DELETE /api/auth/organization/team/remove-member` - Remove team member

#### Access Control (5 endpoints)
- `POST /api/auth/organization/role/create` - Create custom role
- `POST /api/auth/organization/role/update` - Update role
- `DELETE /api/auth/organization/role/delete` - Delete role
- `GET /api/auth/organization/role/list` - List roles
- `GET /api/auth/organization/role/get` - Get role details
- `POST /api/auth/organization/has-permission` - Check permission

**Total: 36 organization management endpoints**

## Role-Based Access Control

### Permission Model

Roles are defined using the `role()` function from Better-Auth's access control plugin:

```typescript
import { role } from "better-auth/plugins/access";

const ownerRole = role({
  organization: ['create', 'read', 'update', 'delete'],
  member: ['create', 'read', 'update', 'delete'],
  invitation: ['create', 'read', 'delete'],
  team: ['create', 'read', 'update', 'delete']
});
```

### Default Roles

1. **Owner**
   - Full access to all organization resources
   - Can manage organization settings, members, invitations, and teams
   - Actions: create, read, update, delete

2. **Admin**
   - Can update organization settings
   - Full member and invitation management
   - Can manage teams
   - Cannot delete organization

3. **Member**
   - Read-only access to organization and members
   - Can view teams
   - Cannot modify anything

## Database Schema

The organization plugin automatically creates the following database tables:

- `organization` - Organization details
- `member` - Organization memberships
- `invitation` - Pending invitations
- `team` - Organization teams (if enabled)
- `teamMember` - Team memberships (if enabled)
- `organizationRole` - Custom roles (if dynamic access control enabled)

These tables integrate with Better-Auth's core tables (user, account, session, verification).

## Testing & Verification

Two verification scripts are provided in `packages/server/scripts/`:

1. **verify-organization-plugin.js** - Quick verification that plugin is loaded
2. **inspect-organization.js** - Detailed inspection of all endpoints and plugin configuration

Run them after building:
```bash
cd packages/server
npm run build
node scripts/verify-organization-plugin.js
node scripts/inspect-organization.js
```

## Documentation

Comprehensive documentation is available in:
- `packages/better-auth/README.md` - Full API reference and usage guide

## Security Considerations

✅ **Security scan passed**: No vulnerabilities detected by CodeQL
✅ **Code review**: Minor suggestions for test scripts only, production code is clean
✅ **TypeScript**: All code is fully typed and type-safe
✅ **Better-Auth**: Uses official library with security best practices built-in

## Next Steps

To use this implementation:

1. Set up a PostgreSQL database
2. Configure `DATABASE_URL` environment variable
3. Better-Auth will automatically create the necessary tables on first use
4. Use the organization endpoints to manage multi-tenant operations

## References

- [Better-Auth Documentation](https://better-auth.com)
- [Better-Auth Organization Plugin](https://better-auth.com/docs/plugins/organization)
- [ObjectQL Documentation](https://github.com/objectql/objectql)
