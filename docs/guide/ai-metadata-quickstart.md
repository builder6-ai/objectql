# AI Metadata Quick Start

This guide shows you how to use ObjectQL's AI metadata definitions in your application.

## Installation

```bash
npm install @objectql/metadata
```

## Basic Usage

### 1. Load AI Metadata

```typescript
import { 
    MetadataRegistry, 
    MetadataLoader, 
    registerObjectQLPlugins 
} from '@objectql/metadata';

const registry = new MetadataRegistry();
const loader = new MetadataLoader(registry);

// Register ObjectQL plugins (includes AI metadata support)
registerObjectQLPlugins(loader);

// Load your metadata directory
loader.load('./metadata');

// Access AI objects
const aiConversation = registry.get('object', 'ai_conversation');
const aiPrompts = registry.get('object', 'ai_prompt');
const aiApp = registry.get('app', 'ai_assistant');
```

### 2. Define AI Configuration

Create an `ai-config.yml` file:

```yaml
# ai-config.yml
enabled: true

defaultModel:
  provider: openai
  model: gpt-4
  temperature: 0.7
  maxTokens: 2000
  timeout: 30000

models:
  fast:
    provider: openai
    model: gpt-3.5-turbo
    temperature: 0.5
    maxTokens: 1000
  
  accurate:
    provider: anthropic
    model: claude-3-opus-20240229
    temperature: 0.3
    maxTokens: 4000

safety:
  enableValidation: true
  enablePermissionCheck: true
  enableRateLimit: true
  rateLimit: 30
  rateLimitWindow: 60000
  enableAuditLog: true
  validationRules:
    maxFilters: 10
    maxFields: 50
    maxLimit: 1000
  blockedFields:
    - password
    - api_key
    - ssn

cache:
  enabled: true
  ttl: 3600
  maxSize: 1000

costTracking:
  enabled: true
  budgetLimit: 1000
  alertThreshold: 0.8
```

### 3. Create AI Prompts

Create prompt templates in `prompts/query_generator.yml`:

```yaml
name: query_generator_v1
label: Natural Language Query Generator
description: Converts natural language requests into ObjectQL queries
category: query_generation

system: |
  You are an expert in ObjectQL, a universal query language.
  Convert natural language requests into valid ObjectQL JSON queries.

template: |
  Schema: {{schema}}
  Request: "{{user_request}}"
  
  Generate a valid ObjectQL query (JSON only, no explanation):

variables:
  - schema
  - user_request

model:
  provider: openai
  model: gpt-4
  temperature: 0.1
  maxTokens: 1000

version: "1.0"
active: true
```

### 4. Use AI Types in TypeScript

```typescript
import { 
    AIConfig, 
    AIModelConfig, 
    AIPromptConfig,
    AISafetyConfig 
} from '@objectql/metadata';

// Type-safe configuration
const config: AIConfig = {
    enabled: true,
    defaultModel: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
    },
    safety: {
        enableValidation: true,
        enableRateLimit: true,
        rateLimit: 30,
        blockedFields: ['password', 'ssn']
    }
};

// Type-safe prompt definition
const prompt: AIPromptConfig = {
    name: 'my_prompt',
    category: 'query_generation',
    template: 'Generate query for: {{request}}',
    variables: ['request'],
    model: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.1
    }
};
```

### 5. Query AI Metadata

```typescript
// List all AI objects
const aiObjects = registry.list('object')
    .filter(obj => obj.name.startsWith('ai_'));

console.log('AI Objects:', aiObjects.map(o => o.name));
// Output: ['ai_conversation', 'ai_prompt', 'ai_operation_log']

// Get specific AI app
const aiApp = registry.get('app', 'ai_assistant');
console.log('AI App Menu:', aiApp.menu);

// Get AI charts
const charts = registry.list('chart')
    .filter(chart => chart.name.startsWith('ai_'));

console.log('AI Charts:', charts.map(c => c.name));
// Output: ['ai_usage_by_type', 'ai_cost_trend']
```

## Example: Building an AI Query Engine

```typescript
import OpenAI from 'openai';
import { AIPromptConfig, AIModelConfig } from '@objectql/metadata';

class AIQueryEngine {
    private openai: OpenAI;
    private registry: MetadataRegistry;
    
    constructor(apiKey: string, registry: MetadataRegistry) {
        this.openai = new OpenAI({ apiKey });
        this.registry = registry;
    }
    
    async generateQuery(userRequest: string, objectName: string) {
        // Get prompt template
        const promptObj = this.registry.get('object', 'ai_prompt');
        const promptData = promptObj.data?.find(
            (p: any) => p.name === 'query_generator_v1'
        );
        
        if (!promptData) {
            throw new Error('Query generator prompt not found');
        }
        
        // Get schema context
        const schema = this.registry.get('object', objectName);
        
        // Fill template
        let prompt = promptData.template;
        prompt = prompt.replace('{{schema}}', JSON.stringify(schema));
        prompt = prompt.replace('{{user_request}}', userRequest);
        
        // Call OpenAI
        const response = await this.openai.chat.completions.create({
            model: promptData.model_name,
            messages: [
                { role: 'system', content: promptData.system_message },
                { role: 'user', content: prompt }
            ],
            temperature: promptData.temperature,
            max_tokens: promptData.max_tokens
        });
        
        const queryText = response.choices[0].message.content;
        const query = JSON.parse(queryText || '{}');
        
        // Log operation
        await this.logOperation({
            operation_type: 'query_generation',
            input_text: userRequest,
            output_data: query,
            model_provider: promptData.model_provider,
            model_name: promptData.model_name,
            tokens_used: response.usage?.total_tokens || 0,
            status: 'success'
        });
        
        return query;
    }
    
    private async logOperation(data: any) {
        // Implementation would save to ai_operation_log object
        console.log('AI Operation:', data);
    }
}

// Usage
const engine = new AIQueryEngine(process.env.OPENAI_API_KEY!, registry);
const query = await engine.generateQuery(
    'Find all tasks assigned to John',
    'tasks'
);
console.log('Generated Query:', query);
```

## Next Steps

- Read the [AI Metadata Reference](../spec/ai-metadata.md) for complete documentation
- Explore the [AI Integration Guide](./ai-integration.md) for advanced patterns
- Check out example fixtures in `packages/metadata/test/fixtures/ai_*.yml`
- Review TypeScript types in `packages/metadata/src/types.ts`

## Support

- GitHub: https://github.com/objectql/objectql
- Documentation: https://docs.objectql.com
- Issues: https://github.com/objectql/objectql/issues
