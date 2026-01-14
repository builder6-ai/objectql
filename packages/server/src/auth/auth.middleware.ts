import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getAuth } from './auth.client.js';

/**
 * Authentication Middleware
 * 
 * Extracts and validates user session from requests, attaching user information to req['user'].
 * 
 * Authentication Strategy (in order of priority):
 * 1. **Better-Auth Session**: Validates JWT tokens and retrieves user session
 * 2. **Development Header**: Falls back to x-user-id header for testing/development
 * 3. **Anonymous**: Defaults to guest user if no authentication found
 * 
 * User Context Structure:
 * - userId: Unique user identifier
 * - roles: Array of role names (e.g., ['admin', 'user'])
 * - spaceId: Organization/workspace identifier (multi-tenancy)
 * - isSystem: Boolean flag for system administrators (bypasses ACL)
 * 
 * Following Rule #2: Security Wrapper Pattern - establishes user context for permission checks
 * 
 * @example
 * // In a controller, access authenticated user
 * @Post()
 * async create(@Req() req: Request) {
 *   const user = req['user'];
 *   console.log('User ID:', user.userId);
 *   console.log('Roles:', user.roles);
 * }
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const auth = await getAuth();
    
    try {
        // Convert Express headers to Fetch API Headers format
        // Better-Auth expects Headers object, not plain object
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
                value.forEach(v => headers.append(key, v));
            } else if (value) {
                headers.append(key, value as string);
            }
        }

      // Strategy 1: Better-Auth Session Validation
      const session = await auth.api.getSession({
          headers: headers
      });
      
      if (session) {
          const role = session.user.role || 'user';
          // Better-Auth provides a single role string, normalize to array
          const roles = [role];

          // Attach full user context to request
          req['user'] = {
              userId: session.user.id,
              id: session.user.id,
              ...session.user, // Include all user fields (name, email, etc.)
              roles: roles,
              spaceId: session.session.activeOrganizationId, // Multi-tenancy support
              sessionId: session.session.id,
              // System admins bypass all ACL checks
              isSystem: ['super_admin'].includes(role)
          };
      } 
      // Strategy 2: Development/Testing Header Fallback
      // Only enabled if OBJECTQL_ALLOW_DEV_HEADERS is explicitly set to 'true'
      // Default: disabled (secure by default)
      else if (req.headers['x-user-id'] && process.env.OBJECTQL_ALLOW_DEV_HEADERS === 'true') {
          // Allow testing without full authentication in development
          // ⚠️ Never enable this in production - it bypasses authentication
          const userId = req.headers['x-user-id'] as string;
          const isAdmin = userId === 'admin';
          req['user'] = {
              userId: userId,
              id: userId,
              roles: isAdmin ? ['admin'] : ['user'],
              spaceId: req.headers['x-space-id'] as string,
              isSystem: isAdmin
          };
      } 
      // Strategy 3: Anonymous/Guest User
      else {
          req['user'] = {
              roles: ['guest'],
              isSystem: false
          };
      }
    } catch (e) {
      // Authentication errors should not crash the server
      // Fall back to guest user and log the error
      console.error("[ObjectOS] Auth Middleware Error:", e);
      req['user'] = {
        roles: ['guest'],
        isSystem: false
      }
    }
    
    next();
  }
}
