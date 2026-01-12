import { describe, it, expect } from 'vitest'
import {
  objectqlTypeToAmisFormType,
  objectqlTypeToAmisColumnType,
  buildAmisCRUDSchema,
} from '../utils/schemaBuilder'

/**
 * Comprehensive field type validation tests
 * Tests all supported ObjectQL field types and their mappings to AMIS components
 */
describe('Field Type Validation - Complete Coverage', () => {
  
  describe('Form Field Type Mappings', () => {
    describe('Text Input Types', () => {
      it('should map text to input-text', () => {
        expect(objectqlTypeToAmisFormType('text')).toBe('input-text')
      })

      it('should map textarea to textarea', () => {
        expect(objectqlTypeToAmisFormType('textarea')).toBe('textarea')
      })

      it('should map email to input-email', () => {
        expect(objectqlTypeToAmisFormType('email')).toBe('input-email')
      })

      it('should map url to input-url', () => {
        expect(objectqlTypeToAmisFormType('url')).toBe('input-url')
      })

      it('should map phone to input-text', () => {
        expect(objectqlTypeToAmisFormType('phone')).toBe('input-text')
      })

      it('should map password to input-password', () => {
        expect(objectqlTypeToAmisFormType('password')).toBe('input-password')
      })

      it('should map html to rich-text', () => {
        expect(objectqlTypeToAmisFormType('html')).toBe('rich-text')
      })
    })

    describe('Number Input Types', () => {
      it('should map number to input-number', () => {
        expect(objectqlTypeToAmisFormType('number')).toBe('input-number')
      })

      it('should map currency to input-number', () => {
        expect(objectqlTypeToAmisFormType('currency')).toBe('input-number')
      })

      it('should map percent to input-number', () => {
        expect(objectqlTypeToAmisFormType('percent')).toBe('input-number')
      })
    })

    describe('Selection Types', () => {
      it('should map select to select', () => {
        expect(objectqlTypeToAmisFormType('select')).toBe('select')
      })

      it('should map picklist to select', () => {
        expect(objectqlTypeToAmisFormType('picklist')).toBe('select')
      })

      it('should map multiselect to multi-select', () => {
        expect(objectqlTypeToAmisFormType('multiselect')).toBe('multi-select')
      })
    })

    describe('Boolean Types', () => {
      it('should map checkbox to checkbox', () => {
        expect(objectqlTypeToAmisFormType('checkbox')).toBe('checkbox')
      })

      it('should map switch to switch', () => {
        expect(objectqlTypeToAmisFormType('switch')).toBe('switch')
      })
    })

    describe('Date/Time Types', () => {
      it('should map date to input-date', () => {
        expect(objectqlTypeToAmisFormType('date')).toBe('input-date')
      })

      it('should map datetime to input-datetime', () => {
        expect(objectqlTypeToAmisFormType('datetime')).toBe('input-datetime')
      })

      it('should map time to input-time', () => {
        expect(objectqlTypeToAmisFormType('time')).toBe('input-time')
      })
    })

    describe('Relationship Types', () => {
      it('should map lookup to select', () => {
        expect(objectqlTypeToAmisFormType('lookup')).toBe('select')
      })

      it('should map master_detail to select', () => {
        expect(objectqlTypeToAmisFormType('master_detail')).toBe('select')
      })
    })

    describe('Special Input Types', () => {
      it('should map color to input-color', () => {
        expect(objectqlTypeToAmisFormType('color')).toBe('input-color')
      })

      it('should map rating to input-rating', () => {
        expect(objectqlTypeToAmisFormType('rating')).toBe('input-rating')
      })

      it('should map slider to input-range', () => {
        expect(objectqlTypeToAmisFormType('slider')).toBe('input-range')
      })
    })

    describe('Unknown Type Handling', () => {
      it('should default unknown types to input-text', () => {
        expect(objectqlTypeToAmisFormType('unknown')).toBe('input-text')
        expect(objectqlTypeToAmisFormType('custom')).toBe('input-text')
        expect(objectqlTypeToAmisFormType('')).toBe('input-text')
      })
    })
  })

  describe('Table Column Type Mappings', () => {
    describe('Text Display Types', () => {
      it('should map text to text', () => {
        expect(objectqlTypeToAmisColumnType('text')).toBe('text')
      })

      it('should map textarea to text', () => {
        expect(objectqlTypeToAmisColumnType('textarea')).toBe('text')
      })

      it('should map email to text', () => {
        expect(objectqlTypeToAmisColumnType('email')).toBe('text')
      })

      it('should map phone to text (implicit)', () => {
        // Phone doesn't have explicit column type, defaults to text
        expect(objectqlTypeToAmisColumnType('phone')).toBe('text')
      })
    })

    describe('Link Types', () => {
      it('should map url to link', () => {
        expect(objectqlTypeToAmisColumnType('url')).toBe('link')
      })

      it('should map file to link', () => {
        expect(objectqlTypeToAmisColumnType('file')).toBe('link')
      })
    })

    describe('Number Display Types', () => {
      it('should map number to number', () => {
        expect(objectqlTypeToAmisColumnType('number')).toBe('number')
      })

      it('should map currency to number', () => {
        expect(objectqlTypeToAmisColumnType('currency')).toBe('number')
      })

      it('should map percent to number', () => {
        expect(objectqlTypeToAmisColumnType('percent')).toBe('number')
      })
    })

    describe('Status Display Types', () => {
      it('should map checkbox to status', () => {
        expect(objectqlTypeToAmisColumnType('checkbox')).toBe('status')
      })

      it('should map switch to switch', () => {
        expect(objectqlTypeToAmisColumnType('switch')).toBe('switch')
      })
    })

    describe('Date/Time Display Types', () => {
      it('should map date to date', () => {
        expect(objectqlTypeToAmisColumnType('date')).toBe('date')
      })

      it('should map datetime to datetime', () => {
        expect(objectqlTypeToAmisColumnType('datetime')).toBe('datetime')
      })

      it('should map time to time', () => {
        expect(objectqlTypeToAmisColumnType('time')).toBe('time')
      })
    })

    describe('Selection Display Types', () => {
      it('should map select to text', () => {
        expect(objectqlTypeToAmisColumnType('select')).toBe('text')
      })

      it('should map picklist to text', () => {
        expect(objectqlTypeToAmisColumnType('picklist')).toBe('text')
      })

      it('should map multiselect to text', () => {
        expect(objectqlTypeToAmisColumnType('multiselect')).toBe('text')
      })
    })

    describe('Relationship Display Types', () => {
      it('should map lookup to text', () => {
        expect(objectqlTypeToAmisColumnType('lookup')).toBe('text')
      })

      it('should map master_detail to text', () => {
        expect(objectqlTypeToAmisColumnType('master_detail')).toBe('text')
      })
    })

    describe('Media Display Types', () => {
      it('should map image to image', () => {
        expect(objectqlTypeToAmisColumnType('image')).toBe('image')
      })
    })

    describe('Special Display Types', () => {
      it('should map color to color', () => {
        expect(objectqlTypeToAmisColumnType('color')).toBe('color')
      })

      it('should map rating to mapping', () => {
        expect(objectqlTypeToAmisColumnType('rating')).toBe('mapping')
      })
    })

    describe('Unknown Type Handling', () => {
      it('should default unknown types to text', () => {
        expect(objectqlTypeToAmisColumnType('unknown')).toBe('text')
        expect(objectqlTypeToAmisColumnType('custom')).toBe('text')
        expect(objectqlTypeToAmisColumnType('')).toBe('text')
      })
    })
  })

  describe('Complete Field Type Integration Tests', () => {
    const createTestMeta = (fields: Record<string, any>) => ({
      name: 'test_object',
      label: 'Test Object',
      fields,
    })

    describe('Text Field Types in Schema', () => {
      it('should generate correct schema for text field', () => {
        const meta = createTestMeta({
          name: { type: 'text', label: 'Name', required: true },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'name')
        
        expect(field.type).toBe('input-text')
        expect(field.required).toBe(true)
      })

      it('should generate correct schema for textarea field', () => {
        const meta = createTestMeta({
          description: { type: 'textarea', label: 'Description' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'description')
        
        expect(field.type).toBe('textarea')
        expect(field.minRows).toBe(3)
        expect(field.maxRows).toBe(10)
      })

      it('should generate correct schema for email field with validation', () => {
        const meta = createTestMeta({
          email: { type: 'email', label: 'Email', required: true },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'email')
        
        expect(field.type).toBe('input-email')
        expect(field.validations).toBeDefined()
        expect(field.validations.isEmail).toBe(true)
      })

      it('should generate correct schema for url field with validation', () => {
        const meta = createTestMeta({
          website: { type: 'url', label: 'Website' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'website')
        
        expect(field.type).toBe('input-url')
        expect(field.validations).toBeDefined()
        expect(field.validations.isUrl).toBe(true)
      })

      it('should generate correct schema for phone field with validation', () => {
        const meta = createTestMeta({
          phone: { type: 'phone', label: 'Phone' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'phone')
        
        expect(field.type).toBe('input-text')
        expect(field.validations).toBeDefined()
        expect(field.validations.matchRegexp).toBeDefined()
      })

      it('should generate correct schema for password field', () => {
        const meta = createTestMeta({
          password: { type: 'password', label: 'Password' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'password')
        
        expect(field.type).toBe('input-password')
      })

      it('should generate correct schema for html/rich-text field', () => {
        const meta = createTestMeta({
          content: { type: 'html', label: 'Content' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'content')
        
        expect(field.type).toBe('rich-text')
      })
    })

    describe('Number Field Types in Schema', () => {
      it('should generate correct schema for number field', () => {
        const meta = createTestMeta({
          quantity: { type: 'number', label: 'Quantity', min: 0, max: 100 },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'quantity')
        
        expect(field.type).toBe('input-number')
        expect(field.min).toBe(0)
        expect(field.max).toBe(100)
      })

      it('should generate correct schema for currency field', () => {
        const meta = createTestMeta({
          price: { type: 'currency', label: 'Price', precision: 2 },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'price')
        
        expect(field.type).toBe('input-number')
        expect(field.prefix).toBe('$')
        expect(field.precision).toBe(2)
      })

      it('should generate correct schema for percent field', () => {
        const meta = createTestMeta({
          discount: { type: 'percent', label: 'Discount' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'discount')
        
        expect(field.type).toBe('input-number')
        expect(field.suffix).toBe('%')
        expect(field.min).toBe(0)
        expect(field.max).toBe(100)
      })
    })

    describe('Boolean Field Types in Schema', () => {
      it('should generate correct schema for checkbox field', () => {
        const meta = createTestMeta({
          active: { type: 'checkbox', label: 'Active' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'active')
        
        expect(field.type).toBe('checkbox')
      })

      it('should generate correct schema for switch field', () => {
        const meta = createTestMeta({
          enabled: { type: 'switch', label: 'Enabled' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'enabled')
        
        expect(field.type).toBe('switch')
      })
    })

    describe('Selection Field Types in Schema', () => {
      it('should generate correct schema for select field with options', () => {
        const meta = createTestMeta({
          status: { 
            type: 'select', 
            label: 'Status',
            options: ['New', 'In Progress', 'Done'],
          },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'status')
        
        expect(field.type).toBe('select')
        expect(field.options).toHaveLength(3)
        expect(field.options[0]).toEqual({ label: 'New', value: 'New' })
      })

      it('should generate correct schema for picklist field', () => {
        const meta = createTestMeta({
          priority: { 
            type: 'picklist', 
            label: 'Priority',
            options: ['Low', 'Medium', 'High'],
          },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'priority')
        
        expect(field.type).toBe('select')
        expect(field.options).toHaveLength(3)
      })

      it('should generate correct schema for multiselect field', () => {
        const meta = createTestMeta({
          categories: { 
            type: 'multiselect', 
            label: 'Categories',
            options: ['A', 'B', 'C'],
          },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'categories')
        
        expect(field.type).toBe('multi-select')
        expect(field.multiple).toBe(true)
        expect(field.options).toHaveLength(3)
      })
    })

    describe('Date/Time Field Types in Schema', () => {
      it('should generate correct schema for date field', () => {
        const meta = createTestMeta({
          birth_date: { type: 'date', label: 'Birth Date' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'birth_date')
        
        expect(field.type).toBe('input-date')
      })

      it('should generate correct schema for datetime field', () => {
        const meta = createTestMeta({
          created_at: { type: 'datetime', label: 'Created At' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'created_at')
        
        expect(field.type).toBe('input-datetime')
      })

      it('should generate correct schema for time field', () => {
        const meta = createTestMeta({
          start_time: { type: 'time', label: 'Start Time' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'start_time')
        
        expect(field.type).toBe('input-time')
      })
    })

    describe('Special Field Types in Schema', () => {
      it('should generate correct schema for color field', () => {
        const meta = createTestMeta({
          theme_color: { type: 'color', label: 'Theme Color' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'theme_color')
        
        expect(field.type).toBe('input-color')
      })

      it('should generate correct schema for rating field', () => {
        const meta = createTestMeta({
          satisfaction: { type: 'rating', label: 'Satisfaction', count: 5 },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'satisfaction')
        
        expect(field.type).toBe('input-rating')
        expect(field.count).toBe(5)
      })

      it('should generate correct schema for slider field', () => {
        const meta = createTestMeta({
          volume: { type: 'slider', label: 'Volume', min: 0, max: 100, step: 5 },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
        const field = dialog.dialog.body.body.find((f: any) => f.name === 'volume')
        
        expect(field.type).toBe('input-range')
        expect(field.min).toBe(0)
        expect(field.max).toBe(100)
        expect(field.step).toBe(5)
      })
    })

    describe('Table Column Generation for All Types', () => {
      it('should generate correct columns for all basic types', () => {
        const meta = createTestMeta({
          text_field: { type: 'text', label: 'Text' },
          number_field: { type: 'number', label: 'Number' },
          checkbox_field: { type: 'checkbox', label: 'Checkbox' },
          date_field: { type: 'date', label: 'Date' },
          url_field: { type: 'url', label: 'URL' },
        })
        const schema = buildAmisCRUDSchema(meta, '/api/data/test')
        const columns = schema.body.columns.filter((c: any) => c.name !== undefined && c.type !== 'operation')
        
        expect(columns).toHaveLength(5)
        
        const textCol = columns.find((c: any) => c.name === 'text_field')
        expect(textCol.type).toBe('text')
        
        const numberCol = columns.find((c: any) => c.name === 'number_field')
        expect(numberCol.type).toBe('number')
        
        const checkboxCol = columns.find((c: any) => c.name === 'checkbox_field')
        expect(checkboxCol.type).toBe('status')
        
        const dateCol = columns.find((c: any) => c.name === 'date_field')
        expect(dateCol.type).toBe('date')
        
        const urlCol = columns.find((c: any) => c.name === 'url_field')
        expect(urlCol.type).toBe('link')
      })
    })
  })

  describe('Field Configuration Properties', () => {
    const createTestMeta = (fields: Record<string, any>) => ({
      name: 'test_object',
      label: 'Test Object',
      fields,
    })

    it('should apply minLength and maxLength to text fields', () => {
      const meta = createTestMeta({
        name: { 
          type: 'text', 
          label: 'Name',
          minLength: 3,
          maxLength: 50,
        },
      })
      const schema = buildAmisCRUDSchema(meta, '/api/data/test')
      const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
      const field = dialog.dialog.body.body.find((f: any) => f.name === 'name')
      
      expect(field.minLength).toBe(3)
      expect(field.maxLength).toBe(50)
    })

    it('should apply placeholder and description to fields', () => {
      const meta = createTestMeta({
        email: { 
          type: 'email', 
          label: 'Email',
          placeholder: 'Enter your email',
          description: 'Your primary email address',
        },
      })
      const schema = buildAmisCRUDSchema(meta, '/api/data/test')
      const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
      const field = dialog.dialog.body.body.find((f: any) => f.name === 'email')
      
      expect(field.placeholder).toBe('Enter your email')
      expect(field.description).toBe('Your primary email address')
    })

    it('should apply help text to fields', () => {
      const meta = createTestMeta({
        password: { 
          type: 'password', 
          label: 'Password',
          help: 'Must be at least 8 characters',
        },
      })
      const schema = buildAmisCRUDSchema(meta, '/api/data/test')
      const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
      const field = dialog.dialog.body.body.find((f: any) => f.name === 'password')
      
      expect(field.hint).toBe('Must be at least 8 characters')
    })

    it('should apply custom pattern validation', () => {
      const meta = createTestMeta({
        code: { 
          type: 'text', 
          label: 'Code',
          pattern: '^[A-Z]{3}\\d{3}$',
        },
      })
      const schema = buildAmisCRUDSchema(meta, '/api/data/test')
      const dialog = schema.body.headerToolbar.find((t: any) => t.label === '新建')
      const field = dialog.dialog.body.body.find((f: any) => f.name === 'code')
      
      expect(field.validations).toBeDefined()
      expect(field.validations.matchRegexp).toBe('^[A-Z]{3}\\d{3}$')
    })
  })
})
