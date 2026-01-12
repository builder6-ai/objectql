# Enhanced Object Form Components

This guide covers the **Enhanced Object Form Components** that extend the base `ObjectForm` with advanced features for building complex, metadata-driven forms.

## Components

- **FormSection** - Grouping container for organizing form fields
- **FormActions** - Standardized form action buttons (Save, Save & New, Cancel)
- **DynamicForm** - Advanced metadata-driven form with sections, tabs, and conditional fields

---

## FormSection

A container component for grouping related form fields with optional collapsible behavior, icons, and flexible layouts.

### Features

- ✅ Collapsible sections with expand/collapse functionality
- ✅ Icon support in section headers
- ✅ 1-column or 2-column layouts
- ✅ Section descriptions
- ✅ Custom styling

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Section title |
| `description` | `string` | - | Optional description text |
| `icon` | `LucideIcon` | - | Icon to display next to title |
| `collapsible` | `boolean` | `false` | Enable collapse/expand behavior |
| `defaultCollapsed` | `boolean` | `false` | Start collapsed (only if collapsible) |
| `columns` | `1 \| 2` | `2` | Number of columns for field layout |
| `children` | `ReactNode` | **Required** | Form fields or content |
| `className` | `string` | - | Additional CSS classes |

### Basic Usage

```tsx
import { FormSection } from '@objectos/ui';
import { User } from 'lucide-react';
import { Field } from '@objectos/ui';

function MyForm() {
  return (
    <form>
      <FormSection 
        title="Personal Information"
        description="Enter your basic details"
        icon={User}
      >
        <Field name="firstName" label="First Name" type="text" />
        <Field name="lastName" label="Last Name" type="text" />
        <Field name="email" label="Email" type="email" />
      </FormSection>
    </form>
  );
}
```

### Collapsible Section

```tsx
<FormSection 
  title="Advanced Settings"
  collapsible={true}
  defaultCollapsed={true}
>
  <Field name="apiKey" label="API Key" type="password" />
  <Field name="webhookUrl" label="Webhook URL" type="url" />
</FormSection>
```

### Single Column Layout

```tsx
<FormSection 
  title="Biography"
  columns={1}
>
  <Field name="bio" label="About You" type="textarea" />
  <Field name="experience" label="Experience" type="textarea" />
</FormSection>
```

---

## FormActions

Standardized action buttons for forms with consistent styling, loading states, and validation feedback.

### Features

- ✅ Save, Save & New, and Cancel buttons
- ✅ Loading states with spinner
- ✅ Validation error count display
- ✅ Automatic button disabling during errors/submission
- ✅ Flexible alignment (left, center, right)
- ✅ Customizable button text

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isSubmitting` | `boolean` | `false` | Show loading state |
| `onSave` | `() => void` | - | Save button callback |
| `onSaveAndNew` | `() => void` | - | Save & New button callback |
| `onCancel` | `() => void` | - | Cancel button callback |
| `saveText` | `string` | `'Save'` | Custom save button text |
| `saveAndNewText` | `string` | `'Save & New'` | Custom Save & New text |
| `cancelText` | `string` | `'Cancel'` | Custom cancel button text |
| `hideSaveAndNew` | `boolean` | `false` | Hide Save & New button |
| `hideCancel` | `boolean` | `false` | Hide Cancel button |
| `errorCount` | `number` | - | Number of validation errors |
| `align` | `'left' \| 'center' \| 'right'` | `'right'` | Button alignment |
| `className` | `string` | - | Additional CSS classes |

### Basic Usage

```tsx
import { FormActions } from '@objectos/ui';

function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await saveData();
    setIsSubmitting(false);
  };

  return (
    <form>
      {/* Form fields */}
      
      <FormActions
        onSave={handleSave}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
```

### With Save & New

```tsx
<FormActions
  onSave={handleSave}
  onSaveAndNew={handleSaveAndNew}
  onCancel={handleCancel}
  saveText="Create User"
  saveAndNewText="Create & Add Another"
/>
```

### With Validation Errors

```tsx
const { formState } = useForm();
const errorCount = Object.keys(formState.errors).length;

<FormActions
  onSave={handleSave}
  errorCount={errorCount}
  // Save button will be disabled if errorCount > 0
/>
```

---

## DynamicForm

An advanced metadata-driven form generator that extends `ObjectForm` with support for sections, tabs, conditional fields, and field dependencies.

### Features

- ✅ Auto-generate from `ObjectConfig` metadata
- ✅ Section-based layouts
- ✅ Tab-based layouts
- ✅ Conditional field visibility
- ✅ Field dependencies
- ✅ Zod-based validation
- ✅ Real-time validation option
- ✅ Integrated FormActions
- ✅ Save & New functionality

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `objectConfig` | `ObjectConfig` | **Required** | Object metadata |
| `onSubmit` | `(data) => void \| Promise<void>` | **Required** | Form submission callback |
| `initialValues` | `Record<string, any>` | `{}` | Initial form data |
| `onCancel` | `() => void` | - | Cancel callback |
| `onSaveAndNew` | `(data) => void \| Promise<void>` | - | Save & New callback |
| `isSubmitting` | `boolean` | `false` | Loading state |
| `submitText` | `string` | `'Save'` | Save button text |
| `saveAndNewText` | `string` | `'Save & New'` | Save & New button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `hideSaveAndNew` | `boolean` | `false` | Hide Save & New button |
| `hideCancelButton` | `boolean` | `false` | Hide cancel button |
| `columns` | `1 \| 2` | `2` | Default column layout |
| `sections` | `FormSectionConfig[]` | - | Section configurations |
| `tabs` | `FormTabConfig[]` | - | Tab configurations |
| `fieldDependencies` | `Record<string, FieldDependency>` | `{}` | Field visibility rules |
| `formRef` | `MutableRefObject<UseFormReturn>` | - | Access form methods |
| `realtimeValidation` | `boolean` | `false` | Enable onChange validation |
| `className` | `string` | - | Additional CSS classes |

### Basic Usage (No Sections)

```tsx
import { DynamicForm } from '@objectos/ui';
import type { ObjectConfig } from '@objectql/types';

const userConfig: ObjectConfig = {
  name: 'user',
  label: 'User',
  fields: {
    firstName: {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    lastName: {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    email: {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
  },
};

function CreateUser() {
  const handleSubmit = async (data: any) => {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <DynamicForm
      objectConfig={userConfig}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
```

### Section-Based Layout

```tsx
import { User, Briefcase, Shield } from 'lucide-react';

const sections = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic user details',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'phone'],
    collapsible: false,
  },
  {
    id: 'company',
    title: 'Company Information',
    icon: Briefcase,
    fields: ['companyName', 'jobTitle', 'department'],
    collapsible: true,
    defaultCollapsed: false,
  },
  {
    id: 'security',
    title: 'Security Settings',
    icon: Shield,
    fields: ['password', 'confirmPassword', 'twoFactorEnabled'],
    collapsible: true,
    defaultCollapsed: true,
    columns: 1, // Single column for this section
  },
];

<DynamicForm
  objectConfig={userConfig}
  onSubmit={handleSubmit}
  sections={sections}
/>
```

### Tab-Based Layout

```tsx
const tabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    sections: [
      {
        id: 'personal',
        title: 'Personal Details',
        fields: ['firstName', 'lastName', 'email'],
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    sections: [
      {
        id: 'settings',
        title: 'Settings',
        fields: ['timezone', 'language', 'notifications'],
      },
      {
        id: 'security',
        title: 'Security',
        fields: ['password', 'twoFactorEnabled'],
        collapsible: true,
      },
    ],
  },
];

<DynamicForm
  objectConfig={userConfig}
  onSubmit={handleSubmit}
  tabs={tabs}
/>
```

### Conditional Field Visibility

Show/hide fields based on other field values:

```tsx
const objectConfig: ObjectConfig = {
  name: 'user',
  fields: {
    hasCompany: {
      name: 'hasCompany',
      label: 'Works for a company?',
      type: 'boolean',
    },
    companyName: {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
    },
    jobTitle: {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'text',
    },
  },
};

const fieldDependencies = {
  companyName: {
    dependsOn: 'hasCompany',
    condition: (value: any) => value === true,
  },
  jobTitle: {
    dependsOn: 'hasCompany',
    condition: (value: any) => value === true,
  },
};

<DynamicForm
  objectConfig={objectConfig}
  onSubmit={handleSubmit}
  fieldDependencies={fieldDependencies}
/>
```

### Conditional Section Visibility

```tsx
const sections = [
  {
    id: 'basic',
    title: 'Basic Info',
    fields: ['name', 'email', 'accountType'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Features',
    fields: ['companyName', 'seats', 'contractId'],
    visible: (values) => values.accountType === 'enterprise',
  },
];

<DynamicForm
  objectConfig={objectConfig}
  onSubmit={handleSubmit}
  sections={sections}
/>
```

### Real-Time Validation

```tsx
<DynamicForm
  objectConfig={userConfig}
  onSubmit={handleSubmit}
  realtimeValidation={true}
  // Fields will be validated onChange instead of onSubmit
/>
```

### Save & New Workflow

```tsx
const handleSubmit = async (data: any) => {
  await createUser(data);
  router.push('/users');
};

const handleSaveAndNew = async (data: any) => {
  await createUser(data);
  toast.success('User created! Add another.');
  // Form will automatically reset for new entry
};

<DynamicForm
  objectConfig={userConfig}
  onSubmit={handleSubmit}
  onSaveAndNew={handleSaveAndNew}
/>
```

### Access Form Methods

```tsx
import { useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

function AdvancedForm() {
  const formRef = useRef<UseFormReturn | null>(null);

  const handleCustomAction = () => {
    if (formRef.current) {
      const values = formRef.current.getValues();
      console.log('Current values:', values);
      
      // Programmatically set a value
      formRef.current.setValue('status', 'active');
      
      // Trigger validation
      formRef.current.trigger();
    }
  };

  return (
    <>
      <button onClick={handleCustomAction}>
        Get Form Data
      </button>
      
      <DynamicForm
        objectConfig={userConfig}
        onSubmit={handleSubmit}
        formRef={formRef}
      />
    </>
  );
}
```

---

## Type Definitions

### FormSectionConfig

```typescript
interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: 1 | 2;
  visible?: (values: Record<string, any>) => boolean;
}
```

### FormTabConfig

```typescript
interface FormTabConfig {
  id: string;
  label: string;
  sections: FormSectionConfig[];
}
```

### FieldDependency

```typescript
interface FieldDependency {
  dependsOn: string;
  condition: (sourceValue: any, allValues: Record<string, any>) => boolean;
}
```

---

## Validation

`DynamicForm` automatically builds a Zod schema from your `ObjectConfig`:

### Supported Validations

- **Required fields**: `required: true`
- **Min/Max values**: `min`, `max` (for numbers)
- **Min/Max length**: `min_length`, `max_length` (for strings)
- **Email format**: `type: 'email'`
- **URL format**: `type: 'url'`
- **Custom patterns**: `regex: '^pattern$'`

### Example

```typescript
const config: ObjectConfig = {
  name: 'user',
  fields: {
    username: {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      min_length: 3,
      max_length: 20,
    },
    age: {
      name: 'age',
      label: 'Age',
      type: 'number',
      min: 18,
      max: 100,
    },
    website: {
      name: 'website',
      label: 'Website',
      type: 'url',
    },
  },
};

// Automatically validates:
// - username: required, 3-20 chars
// - age: 18-100
// - website: valid URL format
```

---

## Best Practices

### 1. Use Sections for Better UX

Break long forms into logical sections:

```tsx
// ❌ BAD: Single long form
<DynamicForm objectConfig={configWith50Fields} />

// ✅ GOOD: Organized sections
<DynamicForm 
  objectConfig={configWith50Fields}
  sections={[
    { id: 'basic', title: 'Basic Info', fields: [...] },
    { id: 'contact', title: 'Contact', fields: [...] },
    { id: 'preferences', title: 'Preferences', fields: [...] },
  ]}
/>
```

### 2. Use Tabs for Complex Forms

When you have multiple categories:

```tsx
<DynamicForm
  objectConfig={employeeConfig}
  tabs={[
    { id: 'personal', label: 'Personal', sections: [...] },
    { id: 'employment', label: 'Employment', sections: [...] },
    { id: 'benefits', label: 'Benefits', sections: [...] },
  ]}
/>
```

### 3. Leverage Field Dependencies

Show relevant fields based on context:

```tsx
// Only show payment fields if user wants to pay now
fieldDependencies={{
  cardNumber: {
    dependsOn: 'paymentTiming',
    condition: (value) => value === 'now',
  },
  cardExpiry: {
    dependsOn: 'paymentTiming',
    condition: (value) => value === 'now',
  },
}}
```

### 4. Use Save & New for Bulk Entry

Perfect for data entry workflows:

```tsx
<DynamicForm
  objectConfig={productConfig}
  onSubmit={createProduct}
  onSaveAndNew={async (data) => {
    await createProduct(data);
    // Form resets automatically
  }}
/>
```

### 5. Enable Real-Time Validation Selectively

Only enable for short forms where immediate feedback helps:

```tsx
// ✅ Good for short forms
<DynamicForm 
  objectConfig={loginConfig}
  realtimeValidation={true}
/>

// ❌ Can be distracting for long forms
<DynamicForm 
  objectConfig={surveyWith100Questions}
  realtimeValidation={true}
/>
```

---

## Migration Guide

### From ObjectForm to DynamicForm

```tsx
// Before: ObjectForm
<ObjectForm
  objectConfig={config}
  onSubmit={handleSubmit}
  columns={2}
/>

// After: DynamicForm (drop-in replacement)
<DynamicForm
  objectConfig={config}
  onSubmit={handleSubmit}
  columns={2}
/>

// With sections (enhanced)
<DynamicForm
  objectConfig={config}
  onSubmit={handleSubmit}
  sections={sections}
/>
```

### Adding FormActions to Custom Forms

```tsx
// Before: Manual buttons
<form onSubmit={handleSubmit}>
  {/* fields */}
  <div className="flex gap-2">
    <Button variant="outline" onClick={onCancel}>Cancel</Button>
    <Button type="submit">Save</Button>
  </div>
</form>

// After: FormActions
<form onSubmit={handleSubmit}>
  {/* fields */}
  <FormActions
    onSave={handleSubmit}
    onCancel={onCancel}
    isSubmitting={isSubmitting}
  />
</form>
```

---

## Examples

See `packages/ui/examples/` for complete working examples:

- `BasicDynamicForm.tsx` - Simple form without sections
- `SectionedForm.tsx` - Form with multiple sections
- `TabbedForm.tsx` - Multi-tab form
- `ConditionalForm.tsx` - Fields with dependencies
- `SaveAndNewForm.tsx` - Bulk data entry workflow

---

## License

Part of the ObjectOS project.
