import { Pool } from "pg";

let authInstance: any;

export const getAuth = async () => {
    if (authInstance) return authInstance;
    const { betterAuth } = await import("better-auth");
    const { organization } = await import("better-auth/plugins");
    
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/objectql'
        });
        authInstance = betterAuth({
            database: pool,
            emailAndPassword: {
                enabled: true
            },
            plugins: [
                organization({
                    // Enable role-based access control
                    dynamicAccessControl: {
                        enabled: true
                    },
                    // Enable teams feature
                    teams: {
                        enabled: true
                    },
                    // Define default organization roles
                    roles: {
                        owner: {
                            name: 'Owner',
                            description: 'Organization owner with full access',
                            permissions: ['*']
                        },
                        admin: {
                            name: 'Admin',
                            description: 'Administrator with management access',
                            permissions: [
                                'organization:read',
                                'organization:update',
                                'member:create',
                                'member:read',
                                'member:update',
                                'member:delete',
                                'invitation:create',
                                'invitation:read',
                                'invitation:delete'
                            ]
                        },
                        member: {
                            name: 'Member',
                            description: 'Regular organization member',
                            permissions: [
                                'organization:read',
                                'member:read'
                            ]
                        }
                    }
                })
            ]
        });
        return authInstance;
    } catch (e: any) {
        console.error("Better Auth Initialization Error:", e);
        throw e;
    }
};

