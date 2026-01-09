# AI Metadata Reference

## Overview

ObjectQL provides comprehensive metadata definitions for AI-powered features. This document describes the AI-related metadata types, configurations, and examples for building intelligent applications.

## AI Metadata Types

### 1. AI Model Configuration (`AIModelConfig`)

Defines configuration for AI/LLM models used in your application.

```typescript
interface AIModelConfig {
    provider: AIModelProvider;  // 'openai' | 'anthropic' | 'azure-openai' | 'google' | 'cohere' | 'ollama' | 'custom'
    model: string;              // Model identifier (e.g., 'gpt-4', 'claude-3-opus')
    endpoint?: string;          // Custom API endpoint
    apiKey?: string;            // API authentication key
    temperature?: number;       // Response randomness (0.0-1.0)
    maxTokens?: number;         // Maximum tokens in response
    topP?: number;              // Top-p sampling parameter
    frequencyPenalty?: number;  // Frequency penalty
    presencePenalty?: number;   // Presence penalty
    timeout?: number;           // Request timeout in ms
    parameters?: Record<string, any>; // Additional parameters
}
```

**Example:**
```yaml
# ai-config.yml
defaultModel:
  provider: openai
  model: gpt-4
  temperature: 0.7
  maxTokens: 2000
  timeout: 30000
```

### 2. AI Prompt Configuration (`AIPromptConfig`)

Defines reusable prompt templates for AI operations.

```typescript
interface AIPromptConfig {
    name: string;               // Unique identifier
    label?: string;             // Display label
    description?: string;       // Purpose description
    category?: 'query_generation' | 'schema_generation' | 'data_analysis' | 'validation' | 'summarization' | 'custom';
    system?: string;            // System message/context
    template: string;           // Template with {{variables}}
    variables?: string[];       // Variable names used
    examples?: Array<{          // Example inputs/outputs
        input: Record<string, any>;
        output?: string;
    }>;
    model?: AIModelConfig;      // Model configuration override
    version?: string;           // Version number
}
```

**Example:**
```yaml
# query_generator.prompt.yml
name: query_generator_v1
label: Natural Language Query Generator
category: query_generation
system: |
  You are an expert in ObjectQL query language.
  Convert natural language to valid ObjectQL queries.
template: |
  Schema: {{schema}}
  Request: "{{user_request}}"
  Generate valid ObjectQL query (JSON only):
variables:
  - schema
  - user_request
model:
  provider: openai
  model: gpt-4
  temperature: 0.1
version: "1.0"
```

### 3. AI Safety Configuration (`AISafetyConfig`)

Defines security and governance rules for AI operations.

```typescript
interface AISafetyConfig {
    enableValidation?: boolean;
    enablePermissionCheck?: boolean;
    enableSanitization?: boolean;
    enableRateLimit?: boolean;
    rateLimit?: number;         // Requests per minute
    rateLimitWindow?: number;   // Window in ms
    enableAuditLog?: boolean;
    validationRules?: AIQueryValidationRules;
    blockedFields?: string[];   // Sensitive fields to block
}
```

**Example:**
```yaml
# ai-safety.yml
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
    allowedEntities:
      - tasks
      - projects
      - contacts
    blockedFields:
      - password
      - ssn
      - api_key
```

### 4. AI Analytics Configuration (`AIAnalyticsConfig`)

Configures AI-powered analytics features.

```typescript
interface AIAnalyticsConfig {
    enableTrendDetection?: boolean;
    enableAnomalyDetection?: boolean;
    enableAutoInsights?: boolean;
    minConfidence?: number;     // Minimum confidence (0.0-1.0)
    refreshInterval?: number;   // Refresh interval in seconds
}
```

### 5. AI Conversation Configuration (`AIConversationConfig`)

Defines chat/conversation configurations.

```typescript
interface AIConversationConfig {
    name: string;
    label?: string;
    description?: string;
    model?: AIModelConfig;
    systemContext?: string;
    maxHistory?: number;
    includeSchemaContext?: boolean;
    contextObjects?: string[];
    enableFunctionCalling?: boolean;
    functions?: Array<{
        name: string;
        description: string;
        parameters: Record<string, any>;
    }>;
}
```

### 6. Main AI Configuration (`AIConfig`)

Top-level AI configuration for your application.

```typescript
interface AIConfig {
    enabled?: boolean;
    defaultModel?: AIModelConfig;
    models?: Record<string, AIModelConfig>;
    prompts?: Record<string, AIPromptConfig>;
    safety?: AISafetyConfig;
    analytics?: AIAnalyticsConfig;
    conversations?: Record<string, AIConversationConfig>;
    cache?: {
        enabled?: boolean;
        ttl?: number;
        maxSize?: number;
    };
    costTracking?: {
        enabled?: boolean;
        budgetLimit?: number;
        alertThreshold?: number;
    };
}
```

## AI Object Definitions

### AI Conversation Object

Stores conversation history and context.

```yaml
# ai_conversation.object.yml
name: ai_conversation
label: AI Conversation
description: Stores AI conversation history and context
icon: ri-message-3-line

fields:
  title:
    type: text
    required: true
    
  session_id:
    type: text
    required: true
    unique: true
    
  user_id:
    type: lookup
    reference_to: users
    required: true
    
  model_provider:
    type: select
    options: [openai, anthropic, google, ollama]
    defaultValue: openai
    
  model_name:
    type: text
    required: true
    
  messages:
    type: grid
    
  total_tokens:
    type: number
    readonly: true
    
  cost:
    type: currency
    precision: 4
    readonly: true
    
  status:
    type: select
    options: [active, completed, failed, archived]
    defaultValue: active
```

### AI Prompt Template Object

Stores reusable prompt templates.

```yaml
# ai_prompt.object.yml
name: ai_prompt
label: AI Prompt Template
description: Reusable prompt templates for AI operations
icon: ri-file-text-line

fields:
  name:
    type: text
    required: true
    unique: true
    
  label:
    type: text
    required: true
    searchable: true
    
  category:
    type: select
    options:
      - query_generation
      - schema_generation
      - data_analysis
      - validation
      - summarization
    required: true
    
  template:
    type: textarea
    required: true
    rows: 10
    
  variables:
    type: grid
    
  temperature:
    type: number
    min: 0.0
    max: 1.0
    defaultValue: 0.7
    
  active:
    type: boolean
    defaultValue: true
    
  usage_count:
    type: number
    defaultValue: 0
    readonly: true
```

### AI Operation Log Object

Audit log for AI operations.

```yaml
# ai_operation_log.object.yml
name: ai_operation_log
label: AI Operation Log
description: Audit log for all AI operations
icon: ri-file-list-3-line

fields:
  operation_id:
    type: text
    required: true
    unique: true
    
  operation_type:
    type: select
    required: true
    options:
      - query_generation
      - schema_generation
      - data_analysis
      - validation
      - conversation
    
  user_id:
    type: lookup
    reference_to: users
    required: true
    
  input_text:
    type: textarea
    
  output_data:
    type: object
    
  tokens_used:
    type: number
    
  cost:
    type: currency
    precision: 4
    
  duration_ms:
    type: number
    
  status:
    type: select
    required: true
    options: [success, failed, partial, timeout]
    
  confidence_score:
    type: number
    min: 0.0
    max: 1.0
    
  created_at:
    type: datetime
    defaultValue: now
    readonly: true
    index: true
```

## AI Application Configuration

Complete AI assistant application example.

```yaml
# ai_assistant.app.yml
name: AI Assistant
code: ai_assistant
description: AI-powered assistant for natural language queries
icon: ri-robot-line
color: purple

menu:
  - label: Conversations
    items:
      - label: Active Chats
        icon: ri-chat-3-line
        type: object
        object: ai_conversation
        
      - label: New Conversation
        icon: ri-add-circle-line
        type: page
        url: /ai/chat/new
  
  - label: Prompts & Templates
    collapsible: true
    items:
      - label: Prompt Library
        icon: ri-file-text-line
        type: object
        object: ai_prompt
        
      - label: Query Templates
        icon: ri-code-box-line
        type: page
        url: /ai/prompts/query
  
  - label: Analytics & Insights
    items:
      - label: Usage Dashboard
        icon: ri-dashboard-line
        type: page
        url: /ai/analytics/dashboard
        
      - label: Cost Tracking
        icon: ri-money-dollar-circle-line
        type: page
        url: /ai/analytics/costs
  
  - label: Administration
    collapsible: true
    collapsed: true
    items:
      - label: Operation Logs
        icon: ri-file-list-3-line
        type: object
        object: ai_operation_log
        
      - label: Model Configuration
        icon: ri-settings-3-line
        type: page
        url: /ai/settings/models
        
      - label: Safety & Governance
        icon: ri-shield-check-line
        type: page
        url: /ai/settings/safety
```

## Usage Examples

### 1. Loading AI Metadata

```typescript
import { MetadataRegistry, MetadataLoader, registerObjectQLPlugins } from '@objectql/metadata';

const registry = new MetadataRegistry();
const loader = new MetadataLoader(registry);

// Register ObjectQL plugins
registerObjectQLPlugins(loader);

// Load AI metadata
loader.load('./src/ai');

// Access AI objects
const aiConversations = registry.get('object', 'ai_conversation');
const aiPrompts = registry.get('object', 'ai_prompt');
const aiApp = registry.get('app', 'ai_assistant');
```

### 2. Using AI Prompts

```typescript
// Get prompt template
const queryGenerator = registry.get('prompt', 'query_generator_v1') as AIPromptConfig;

// Fill template variables
const prompt = queryGenerator.template
    .replace('{{schema}}', JSON.stringify(schema))
    .replace('{{user_request}}', userRequest);

// Execute with configured model
const response = await llm.generate(prompt, queryGenerator.model);
```

### 3. Logging AI Operations

```typescript
// Create operation log entry
await db.object('ai_operation_log').create({
    operation_id: generateId(),
    operation_type: 'query_generation',
    user_id: currentUser.id,
    input_text: userRequest,
    output_data: generatedQuery,
    model_provider: 'openai',
    model_name: 'gpt-4',
    tokens_used: response.usage.total_tokens,
    cost: calculateCost(response.usage),
    duration_ms: elapsedTime,
    status: 'success',
    confidence_score: 0.95
});
```

## Best Practices

### 1. Prompt Versioning

Always version your prompts to track changes and enable rollback:

```yaml
name: query_generator_v2  # Increment version
version: "2.0"
```

### 2. Cost Tracking

Enable cost tracking to monitor AI expenses:

```yaml
costTracking:
  enabled: true
  budgetLimit: 1000  # USD per month
  alertThreshold: 0.8  # Alert at 80%
```

### 3. Rate Limiting

Protect your application with rate limits:

```yaml
safety:
  enableRateLimit: true
  rateLimit: 30  # 30 requests per minute
  rateLimitWindow: 60000
```

### 4. Audit Logging

Always log AI operations for compliance:

```yaml
safety:
  enableAuditLog: true
```

### 5. Field-Level Security

Block sensitive fields from AI access:

```yaml
safety:
  blockedFields:
    - password
    - ssn
    - credit_card
    - api_key
```

## Schema Validation

AI metadata follows standard ObjectQL validation rules. Use TypeScript for type safety:

```typescript
import { AIConfig, AIPromptConfig, AIModelConfig } from '@objectql/metadata';

const config: AIConfig = {
    enabled: true,
    defaultModel: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
    },
    safety: {
        enableValidation: true,
        enableRateLimit: true,
        rateLimit: 30
    }
};
```

## Related Documentation

- [AI Integration Guide](../guide/ai-integration.md) - How to integrate AI features
- [Data Modeling Guide](../guide/data-modeling.md) - General object modeling
- [Metadata Format Specification](./metadata-format.md) - Metadata file formats
- [API Reference](../api/) - API documentation

## Support

For questions and issues:
- GitHub Issues: https://github.com/objectql/objectql/issues
- Documentation: https://docs.objectql.com
- Community: https://community.objectql.com

---

**Last Updated:** 2026-01-09  
**Version:** 1.0  
**License:** MIT
