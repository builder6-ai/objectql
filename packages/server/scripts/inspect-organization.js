#!/usr/bin/env node
/**
 * Detailed inspection of Better-Auth organization plugin
 */

async function inspectOrganization() {
    console.log('🔍 Detailed Better-Auth Organization Plugin Inspection...\n');
    
    try {
        const { getAuth } = require('../dist/auth/auth.client');
        const auth = await getAuth();
        
        console.log('Auth instance keys:', Object.keys(auth));
        console.log('\nAPI endpoints:');
        
        if (auth.api) {
            const apiKeys = Object.keys(auth.api);
            console.log(`Total endpoints: ${apiKeys.length}\n`);
            
            // Group endpoints by prefix
            const groups = {};
            apiKeys.forEach(key => {
                const prefix = key.split(/[A-Z]/)[0] || 'other';
                if (!groups[prefix]) groups[prefix] = [];
                groups[prefix].push(key);
            });
            
            Object.keys(groups).sort().forEach(group => {
                console.log(`\n${group}:`);
                groups[group].forEach(ep => console.log(`  - ${ep}`));
            });
        }
        
        console.log('\n\nPlugin options:');
        if (auth.options && auth.options.plugins) {
            auth.options.plugins.forEach((plugin, i) => {
                console.log(`\nPlugin ${i + 1}:`);
                console.log('  Keys:', Object.keys(plugin));
                if (plugin.id) console.log('  ID:', plugin.id);
                if (plugin.endpoints) {
                    console.log('  Endpoints:', Object.keys(plugin.endpoints));
                }
                if (plugin.schema) {
                    console.log('  Schema:', Object.keys(plugin.schema));
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Inspection failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

inspectOrganization();
