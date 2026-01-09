import { MetadataRegistry } from '../src/registry';
import { MetadataLoader } from '../src/loader';
import { registerObjectQLPlugins } from '../src/plugins/objectql';
import { isAppMenuSection } from '../src/types';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('MetadataRegistry', () => {
    it('should register and retrieve metadata', () => {
        const registry = new MetadataRegistry();
        registry.register('test', {
            type: 'test',
            id: 'item1',
            content: { value: 1 }
        });

        const item = registry.get('test', 'item1');
        expect(item).toEqual({ value: 1 });
        
        const list = registry.list('test');
        expect(list).toHaveLength(1);
        expect(list[0]).toEqual({ value: 1 });
    });

    it('should unregister metadata', () => {
        const registry = new MetadataRegistry();
        registry.register('test', { type: 'test', id: 'item1', content: {} });
        registry.unregister('test', 'item1');
        expect(registry.get('test', 'item1')).toBeUndefined();
    });
});

describe('MetadataLoader', () => {
    it('should load files using plugins', () => {
        const registry = new MetadataRegistry();
        const loader = new MetadataLoader(registry);
        
        loader.use({
            name: 'test-plugin',
            glob: ['**/*.test.yml'],
            handler: (ctx) => {
                const doc = yaml.load(ctx.content) as any;
                ctx.registry.register('test', {
                    type: 'test',
                    id: doc.name,
                    path: ctx.file,
                    content: doc
                });
            }
        });

        const fixturesDir = path.join(__dirname, 'fixtures');
        loader.load(fixturesDir);

        const item = registry.get('test', 'test-item');
        expect(item).toBeDefined();
        expect(item.value).toBe(123);
    });

    it('should load package (fallback to directory)', () => {
        const registry = new MetadataRegistry();
        const loader = new MetadataLoader(registry);
        
        loader.use({
            name: 'test-plugin',
            glob: ['**/*.test.yml'],
            handler: (ctx) => {
                const doc = yaml.load(ctx.content) as any;
                ctx.registry.register('test', {
                    type: 'test',
                    id: doc.name,
                    path: ctx.file,
                    content: doc
                });
            }
        });

        const fixturesDir = path.join(__dirname, 'fixtures');
        // mocked package load pointing to a directory
        loader.loadPackage(fixturesDir);

        const item = registry.get('test', 'test-item');
        expect(item).toBeDefined();
        expect(item.value).toBe(123);
    });
});

describe('ObjectQL Plugins - App with Menu', () => {
    it('should load app with menu configuration', () => {

        const registry = new MetadataRegistry();
        const loader = new MetadataLoader(registry);
        
        registerObjectQLPlugins(loader);

        const fixturesDir = path.join(__dirname, 'fixtures');
        loader.load(fixturesDir);

        const app = registry.get('app', 'Sample App');
        expect(app).toBeDefined();
        expect(app.name).toBe('Sample App');
        expect(app.code).toBe('sample');
        expect(app.icon).toBe('ri-apps-line');
        expect(app.menu).toBeDefined();
        expect(Array.isArray(app.menu)).toBe(true);
        expect(app.menu.length).toBe(2);
        
        // Check first menu section
        const mainSection = app.menu[0];
        expect(mainSection.label).toBe('Main');
        expect(mainSection.items).toBeDefined();
        expect(mainSection.items.length).toBe(2);
        
        // Check menu items
        const dashboardItem = mainSection.items[0];
        expect(dashboardItem.label).toBe('Dashboard');
        expect(dashboardItem.icon).toBe('ri-dashboard-line');
        expect(dashboardItem.type).toBe('page');
        expect(dashboardItem.url).toBe('/dashboard');
        
        const projectsItem = mainSection.items[1];
        expect(projectsItem.label).toBe('Projects');
        expect(projectsItem.type).toBe('object');
        expect(projectsItem.object).toBe('projects');
        
        // Check second section
        const settingsSection = app.menu[1];
        expect(settingsSection.label).toBe('Settings');
        expect(settingsSection.collapsible).toBe(true);
        expect(settingsSection.items.length).toBe(1);
    });
});

describe('Type Guards', () => {
    it('should correctly identify menu sections', () => {
        const section = {
            label: 'Main',
            items: [
                { label: 'Dashboard', type: 'page' as const, url: '/dashboard' }
            ]
        };
        
        expect(isAppMenuSection(section)).toBe(true);
    });
    
    it('should correctly identify menu items', () => {
        const item = {
            label: 'Dashboard',
            type: 'page' as const,
            url: '/dashboard'
        };
        
        expect(isAppMenuSection(item)).toBe(false);
    });
    
    it('should handle nested menu items', () => {
        const itemWithSubItems = {
            label: 'Projects',
            type: 'page' as const,
            items: [
                { label: 'Active', type: 'page' as const, url: '/active' }
            ]
        };
        
        // This should be identified as a menu item (has type property)
        expect(isAppMenuSection(itemWithSubItems)).toBe(false);
    });
});

describe('AI Metadata', () => {
    it('should load AI objects and app configuration', () => {
        const registry = new MetadataRegistry();
        const loader = new MetadataLoader(registry);
        
        registerObjectQLPlugins(loader);

        const fixturesDir = path.join(__dirname, 'fixtures');
        loader.load(fixturesDir);

        // Check AI conversation object
        const aiConversation = registry.get('object', 'ai_conversation');
        expect(aiConversation).toBeDefined();
        expect(aiConversation.name).toBe('ai_conversation');
        expect(aiConversation.label).toBe('AI Conversation');
        expect(aiConversation.fields).toBeDefined();
        expect(aiConversation.fields.session_id).toBeDefined();
        expect(aiConversation.fields.session_id.unique).toBe(true);
        expect(aiConversation.fields.model_provider.type).toBe('select');
        
        // Check AI prompt object
        const aiPrompt = registry.get('object', 'ai_prompt');
        expect(aiPrompt).toBeDefined();
        expect(aiPrompt.name).toBe('ai_prompt');
        expect(aiPrompt.label).toBe('AI Prompt Template');
        expect(aiPrompt.fields.category).toBeDefined();
        expect(aiPrompt.fields.category.options).toContain('query_generation');
        expect(aiPrompt.fields.temperature.min).toBe(0.0);
        expect(aiPrompt.fields.temperature.max).toBe(1.0);
        
        // Check AI operation log object
        const aiLog = registry.get('object', 'ai_operation_log');
        expect(aiLog).toBeDefined();
        expect(aiLog.name).toBe('ai_operation_log');
        expect(aiLog.label).toBe('AI Operation Log');
        expect(aiLog.fields.operation_type).toBeDefined();
        expect(aiLog.fields.cost.type).toBe('currency');
        
        // Check AI assistant app
        const aiApp = registry.get('app', 'AI Assistant');
        expect(aiApp).toBeDefined();
        expect(aiApp.name).toBe('AI Assistant');
        expect(aiApp.code).toBe('ai_assistant');
        expect(aiApp.icon).toBe('ri-robot-line');
        expect(aiApp.color).toBe('purple');
        expect(aiApp.menu).toBeDefined();
        expect(Array.isArray(aiApp.menu)).toBe(true);
        expect(aiApp.menu.length).toBeGreaterThan(0);
        
        // Check AI charts
        const aiUsageChart = registry.get('chart', 'ai_usage_by_type');
        expect(aiUsageChart).toBeDefined();
        expect(aiUsageChart.type).toBe('bar');
        expect(aiUsageChart.object).toBe('ai_operation_log');
        
        const aiCostChart = registry.get('chart', 'ai_cost_trend');
        expect(aiCostChart).toBeDefined();
        expect(aiCostChart.type).toBe('line');
        
        // Check AI page
        const aiPage = registry.get('page', 'ai_analytics_dashboard');
        expect(aiPage).toBeDefined();
        expect(aiPage.label).toBe('AI Analytics Dashboard');
        expect(aiPage.layout).toBe('grid');
        expect(aiPage.components).toBeDefined();
    });
    
    it('should load AI prompt data fixtures', () => {
        const registry = new MetadataRegistry();
        const loader = new MetadataLoader(registry);
        
        registerObjectQLPlugins(loader);

        const fixturesDir = path.join(__dirname, 'fixtures');
        loader.load(fixturesDir);

        // Check that prompt data was loaded
        const aiPromptObj = registry.get('object', 'ai_prompt');
        expect(aiPromptObj).toBeDefined();
        
        // The data should have been loaded via .data.yml file
        if (aiPromptObj.data) {
            expect(Array.isArray(aiPromptObj.data)).toBe(true);
            expect(aiPromptObj.data.length).toBeGreaterThan(0);
            
            // Check for query generator prompt
            interface PromptData {
                name: string;
                category: string;
                model_provider: string;
                model_name: string;
            }
            const queryPrompt = aiPromptObj.data.find((p: PromptData) => p.name === 'query_generator_v1');
            if (queryPrompt) {
                expect(queryPrompt.category).toBe('query_generation');
                expect(queryPrompt.model_provider).toBe('openai');
                expect(queryPrompt.model_name).toBe('gpt-4');
            }
        }
    });
});
