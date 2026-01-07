
export type FieldType = 
    | 'text' 
    | 'textarea' 
    | 'html' 
    | 'select' 
    | 'multiselect' 
    | 'date' 
    | 'datetime' 
    | 'number' 
    | 'currency' 
    | 'boolean' 
    | 'lookup' 
    | 'master_detail' 
    | 'password'
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
    defaultValue?: any;
    
    // String options
    options?: FieldOption[] | string[];
    
    // Number options
    scale?: number;
    precision?: number;
    
    // Relationship properties
    reference_to?: string;

    // UI properties (kept for compatibility, though ObjectQL is a query engine)
    searchable?: boolean;
    sortable?: boolean;
    index?: boolean;
    
    // Other properties
    description?: string;
}

export interface ObjectConfig {
    name: string;
    label?: string;
    icon?: string;
    description?: string;
    
    fields: Record<string, FieldConfig>;
    
}
