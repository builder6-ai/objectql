#!/usr/bin/env node
/**
 * Verification script for Better-Auth organization plugin
 * 
 * This script checks that the organization plugin is properly initialized
 * and the expected endpoints are available.
 */

async function verifyOrganizationPlugin() {
    console.log('🔍 Verifying Better-Auth Organization Plugin Setup...\n');
    
    try {
        // Import the auth client
        const { getAuth } = require('../dist/auth/auth.client');
        
        console.log('✓ Successfully imported auth client');
        
        // Get the auth instance
        const auth = await getAuth();
        
        console.log('✓ Successfully initialized Better-Auth instance');
        
        // Check if organization plugin is loaded
        if (auth && auth.options && auth.options.plugins) {
            console.log(`✓ Plugins loaded: ${auth.options.plugins.length} plugin(s)`);
            
            // Check for organization endpoints
            const endpoints = auth.api || {};
            const organizationEndpoints = Object.keys(endpoints).filter(key => 
                key.includes('organization') || 
                key.includes('member') || 
                key.includes('invitation')
            );
            
            if (organizationEndpoints.length > 0) {
                console.log(`✓ Organization endpoints detected: ${organizationEndpoints.length} endpoints`);
                console.log('\nSample endpoints:');
                organizationEndpoints.slice(0, 10).forEach(ep => {
                    console.log(`  - ${ep}`);
                });
                if (organizationEndpoints.length > 10) {
                    console.log(`  ... and ${organizationEndpoints.length - 10} more`);
                }
            } else {
                console.log('⚠ No organization-specific endpoints found in API');
                console.log('Available endpoints:', Object.keys(endpoints).slice(0, 5).join(', '), '...');
            }
        }
        
        console.log('\n✅ Organization plugin verification complete!');
        console.log('\nExpected organization features:');
        console.log('  • Multi-tenant organization management');
        console.log('  • Role-based access control (owner, admin, member)');
        console.log('  • Team support');
        console.log('  • Invitation system');
        console.log('\nEndpoints should be available at: /api/auth/organization/*');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
}

verifyOrganizationPlugin();
