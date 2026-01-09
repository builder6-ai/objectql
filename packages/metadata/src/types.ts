export type FieldType = 
    | 'text' 
    | 'textarea' 
    | 'markdown'
    | 'html' 
    | 'select' 
    | 'date' 
    | 'datetime' 
    | 'time'
    | 'number' 
    | 'currency' 
    | 'percent'
    | 'boolean' 
    | 'email'
    | 'phone'
    | 'url'
    | 'image'
    | 'file'
    | 'avatar'
    | 'location'
    | 'lookup' 
    | 'master_detail'  
    | 'password'
    | 'formula'
    | 'summary'
    | 'auto_number'
    | 'object'
    | 'grid';

export interface FieldOption {
    label: string;
    value: string | number;
}

export interface FieldConfig {
    name?: string;
    label?: string;
    type: FieldType;
    required?: boolean;
    unique?: boolean;
    readonly?: boolean;
    hidden?: boolean;
    defaultValue?: any;
    help_text?: string;
    multiple?: boolean;
    
    // Validation
    min?: number;
    max?: number;
    min_length?: number;
    max_length?: number;
    regex?: string;

    options?: FieldOption[] | string[];
    scale?: number;
    precision?: number;
    rows?: number;

    reference_to?: string;
    
    // Formula
    expression?: string;
    data_type?: 'text' | 'boolean' | 'date' | 'datetime' | 'number' | 'currency' | 'percent';

    // Summary
    summary_object?: string;
    summary_type?: 'count' | 'sum' | 'min' | 'max' | 'avg';
    summary_field?: string;
    summary_filters?: any[] | string;

    // Auto Number
    auto_number_format?: string;

    searchable?: boolean;
    sortable?: boolean;
    index?: boolean;
    description?: string;
}

export interface ActionConfig {
    label?: string;
    description?: string;
    handler?: Function;
    result?: unknown;
}

export interface ObjectConfig {
    name: string;
    label?: string;
    description?: string;
    icon?: string;
    fields?: Record<string, FieldConfig>;
    methods?: Record<string, Function>;
    listeners?: Record<string, Function>;
    actions?: Record<string, ActionConfig>;
    data?: any[];
}

/**
 * Menu item configuration for app interfaces.
 * Similar to Airtable's interface menu structure.
 */
export interface AppMenuItem {
    /** Unique identifier for the menu item */
    id?: string;
    /** Display label for the menu item */
    label?: string;
    /** Icon identifier (e.g., remixicon class name like 'ri-home-line') */
    icon?: string;
    /** Type of menu item */
    type?: 'object' | 'page' | 'url' | 'divider';
    /** Reference to an object name (for type: 'object') */
    object?: string;
    /** URL path (for type: 'url' or 'page') */
    url?: string;
    /** Badge text or count to display */
    badge?: string | number;
    /** Whether this item is visible */
    visible?: boolean;
    /** Nested sub-menu items */
    items?: AppMenuItem[];
}

/**
 * Menu section/group configuration for organizing menu items.
 */
export interface AppMenuSection {
    /** Section title/label */
    label?: string;
    /** **Required.** Menu items in this section. */
    items: AppMenuItem[];
    /** Whether this section is collapsible */
    collapsible?: boolean;
    /** Whether this section is collapsed by default */
    collapsed?: boolean;
}

/**
 * Type guard to check if a menu entry is a section vs a direct menu item.
 * A section has an 'items' array and lacks menu item-specific properties like 'type', 'object', or 'url'.
 * It may also have section-specific properties like 'collapsible' or 'collapsed'.
 */
export function isAppMenuSection(entry: AppMenuSection | AppMenuItem): entry is AppMenuSection {
    return 'items' in entry && 
           Array.isArray(entry.items) && 
           !('type' in entry) && 
           !('object' in entry) && 
           !('url' in entry);
}

/**
 * App configuration metadata.
 * Represents an application or interface with its own menu structure.
 */
export interface AppConfig {
    /** Unique identifier or code for the app */
    id?: string;
    /** App name */
    name: string;
    /** App code/slug */
    code?: string;
    /** Description of the app */
    description?: string;
    /** App icon identifier */
    icon?: string;
    /** Color theme for the app */
    color?: string;
    /** Dark mode preference */
    dark?: boolean;
    /** 
     * Left-side menu configuration.
     * Can be either:
     * - An array of menu sections (recommended for organized menus with groups)
     * - An array of menu items (for simple flat menus)
     * 
     * Use the `isAppMenuSection()` type guard to distinguish between them at runtime.
     */
    menu?: AppMenuSection[] | AppMenuItem[];
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartConfig {
    name: string;
    label?: string;
    description?: string;
    type: ChartType;
    object: string;
    xAxisKey: string;
    yAxisKeys: string[];
    height?: number;
    colors?: string[];
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    filters?: any[];
    sort?: [string, 'asc' | 'desc'][];
}

export type PageLayoutType = 'grid' | 'flex' | 'stack' | 'tabs';

export interface PageComponent {
    type: string;
    props?: Record<string, any>;
    children?: PageComponent[];
}

export interface PageConfig {
    name: string;
    label?: string;
    description?: string;
    icon?: string;
    layout?: PageLayoutType;
    components?: PageComponent[];
    settings?: Record<string, any>;
}

/**
 * AI Model Provider types supported by ObjectQL
 */
export type AIModelProvider = 'openai' | 'anthropic' | 'azure-openai' | 'google' | 'cohere' | 'ollama' | 'custom';

/**
 * AI Model configuration for LLM integration
 */
export interface AIModelConfig {
    /** Model provider (OpenAI, Anthropic, etc.) */
    provider: AIModelProvider;
    /** Model name/identifier (e.g., 'gpt-4', 'claude-3-opus') */
    model: string;
    /** API endpoint URL (optional for standard providers) */
    endpoint?: string;
    /** API key or authentication token */
    apiKey?: string;
    /** Temperature for response randomness (0.0-1.0) */
    temperature?: number;
    /** Maximum tokens in response */
    maxTokens?: number;
    /** Top-p sampling parameter */
    topP?: number;
    /** Frequency penalty */
    frequencyPenalty?: number;
    /** Presence penalty */
    presencePenalty?: number;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Additional model-specific parameters */
    parameters?: Record<string, any>;
}

/**
 * AI Prompt template configuration
 */
export interface AIPromptConfig {
    /** Unique identifier for the prompt */
    name: string;
    /** Display label */
    label?: string;
    /** Description of prompt purpose */
    description?: string;
    /** Prompt category/type */
    category?: 'query_generation' | 'schema_generation' | 'data_analysis' | 'validation' | 'summarization' | 'custom';
    /** System message/context */
    system?: string;
    /** User message template (supports variables like {{variable}}) */
    template: string;
    /** List of variables used in template */
    variables?: string[];
    /** Example inputs for testing */
    examples?: Array<{
        input: Record<string, any>;
        output?: string;
    }>;
    /** Model configuration override */
    model?: AIModelConfig;
    /** Version number for prompt versioning */
    version?: string;
}

/**
 * AI Query validation rules
 */
export interface AIQueryValidationRules {
    /** Maximum number of filters allowed */
    maxFilters?: number;
    /** Maximum number of fields to return */
    maxFields?: number;
    /** Maximum result limit */
    maxLimit?: number;
    /** Allowed objects/entities */
    allowedEntities?: string[];
    /** Blocked objects/entities */
    blockedEntities?: string[];
    /** Allowed field types */
    allowedFieldTypes?: FieldType[];
    /** Enable aggregation queries */
    allowAggregation?: boolean;
    /** Enable join queries */
    allowJoins?: boolean;
}

/**
 * AI Safety and governance configuration
 */
export interface AISafetyConfig {
    /** Enable query validation */
    enableValidation?: boolean;
    /** Enable permission checking */
    enablePermissionCheck?: boolean;
    /** Enable content sanitization */
    enableSanitization?: boolean;
    /** Enable rate limiting */
    enableRateLimit?: boolean;
    /** Rate limit: requests per minute */
    rateLimit?: number;
    /** Rate limit window in milliseconds */
    rateLimitWindow?: number;
    /** Enable audit logging */
    enableAuditLog?: boolean;
    /** Validation rules */
    validationRules?: AIQueryValidationRules;
    /** Blocked sensitive fields */
    blockedFields?: string[];
}

/**
 * AI Analytics configuration for data analysis features
 */
export interface AIAnalyticsConfig {
    /** Enable trend detection */
    enableTrendDetection?: boolean;
    /** Enable anomaly detection */
    enableAnomalyDetection?: boolean;
    /** Enable automatic insights */
    enableAutoInsights?: boolean;
    /** Minimum confidence score (0.0-1.0) */
    minConfidence?: number;
    /** Data refresh interval in seconds */
    refreshInterval?: number;
}

/**
 * AI Conversation/Chat configuration
 */
export interface AIConversationConfig {
    /** Conversation name/identifier */
    name: string;
    /** Display label */
    label?: string;
    /** Description */
    description?: string;
    /** Model configuration */
    model?: AIModelConfig;
    /** System context/instructions */
    systemContext?: string;
    /** Maximum conversation history length */
    maxHistory?: number;
    /** Enable context from schema */
    includeSchemaContext?: boolean;
    /** Objects to include in context */
    contextObjects?: string[];
    /** Enable function calling */
    enableFunctionCalling?: boolean;
    /** Available functions */
    functions?: Array<{
        name: string;
        description: string;
        parameters: Record<string, any>;
    }>;
}

/**
 * Main AI configuration for ObjectQL applications
 */
export interface AIConfig {
    /** Enable AI features */
    enabled?: boolean;
    /** Default model configuration */
    defaultModel?: AIModelConfig;
    /** Available models */
    models?: Record<string, AIModelConfig>;
    /** Prompt templates */
    prompts?: Record<string, AIPromptConfig>;
    /** Safety and governance settings */
    safety?: AISafetyConfig;
    /** Analytics configuration */
    analytics?: AIAnalyticsConfig;
    /** Conversation configurations */
    conversations?: Record<string, AIConversationConfig>;
    /** Cache configuration */
    cache?: {
        enabled?: boolean;
        ttl?: number;
        maxSize?: number;
    };
    /** Cost tracking */
    costTracking?: {
        enabled?: boolean;
        budgetLimit?: number;
        alertThreshold?: number;
    };
}
