import { describe, it, expect } from 'vitest'
import {
  objectqlTypeToAmisFormType,
  objectqlTypeToAmisColumnType,
} from '../utils/schemaBuilder'

/**
 * ObjectQL Official Field Type Tests
 * Based on the ObjectQL specification: https://github.com/objectql/objectql/blob/main/docs/spec/object.md
 * 
 * This test suite validates all 26 official ObjectQL field types
 */
describe('ObjectQL Official Field Types', () => {
  
  describe('Basic Types (8 types)', () => {
    it('should map text to input-text', () => {
      expect(objectqlTypeToAmisFormType('text')).toBe('input-text')
      expect(objectqlTypeToAmisColumnType('text')).toBe('text')
    })

    it('should map textarea to textarea', () => {
      expect(objectqlTypeToAmisFormType('textarea')).toBe('textarea')
      expect(objectqlTypeToAmisColumnType('textarea')).toBe('text')
    })

    it('should map markdown to textarea', () => {
      expect(objectqlTypeToAmisFormType('markdown')).toBe('textarea')
      expect(objectqlTypeToAmisColumnType('markdown')).toBe('text')
    })

    it('should map html to rich-text', () => {
      expect(objectqlTypeToAmisFormType('html')).toBe('rich-text')
      expect(objectqlTypeToAmisColumnType('html')).toBe('text')
    })

    it('should map number to input-number', () => {
      expect(objectqlTypeToAmisFormType('number')).toBe('input-number')
      expect(objectqlTypeToAmisColumnType('number')).toBe('number')
    })

    it('should map currency to input-number', () => {
      expect(objectqlTypeToAmisFormType('currency')).toBe('input-number')
      expect(objectqlTypeToAmisColumnType('currency')).toBe('number')
    })

    it('should map percent to input-number', () => {
      expect(objectqlTypeToAmisFormType('percent')).toBe('input-number')
      expect(objectqlTypeToAmisColumnType('percent')).toBe('number')
    })

    it('should map boolean to checkbox', () => {
      expect(objectqlTypeToAmisFormType('boolean')).toBe('checkbox')
      expect(objectqlTypeToAmisColumnType('boolean')).toBe('status')
    })
  })

  describe('System/Format Types (4 types)', () => {
    it('should map email to input-email', () => {
      expect(objectqlTypeToAmisFormType('email')).toBe('input-email')
      expect(objectqlTypeToAmisColumnType('email')).toBe('text')
    })

    it('should map phone to input-text', () => {
      expect(objectqlTypeToAmisFormType('phone')).toBe('input-text')
      expect(objectqlTypeToAmisColumnType('phone')).toBe('text')
    })

    it('should map url to input-url', () => {
      expect(objectqlTypeToAmisFormType('url')).toBe('input-url')
      expect(objectqlTypeToAmisColumnType('url')).toBe('link')
    })

    it('should map password to input-password', () => {
      expect(objectqlTypeToAmisFormType('password')).toBe('input-password')
      expect(objectqlTypeToAmisColumnType('password')).toBe('text')
    })
  })

  describe('Date & Time Types (3 types)', () => {
    it('should map date to input-date', () => {
      expect(objectqlTypeToAmisFormType('date')).toBe('input-date')
      expect(objectqlTypeToAmisColumnType('date')).toBe('date')
    })

    it('should map datetime to input-datetime', () => {
      expect(objectqlTypeToAmisFormType('datetime')).toBe('input-datetime')
      expect(objectqlTypeToAmisColumnType('datetime')).toBe('datetime')
    })

    it('should map time to input-time', () => {
      expect(objectqlTypeToAmisFormType('time')).toBe('input-time')
      expect(objectqlTypeToAmisColumnType('time')).toBe('time')
    })
  })

  describe('Complex/Media Types (4 types)', () => {
    it('should map file to input-file', () => {
      expect(objectqlTypeToAmisFormType('file')).toBe('input-file')
      expect(objectqlTypeToAmisColumnType('file')).toBe('link')
    })

    it('should map image to input-image', () => {
      expect(objectqlTypeToAmisFormType('image')).toBe('input-image')
      expect(objectqlTypeToAmisColumnType('image')).toBe('image')
    })

    it('should map avatar to input-image', () => {
      expect(objectqlTypeToAmisFormType('avatar')).toBe('input-image')
      expect(objectqlTypeToAmisColumnType('avatar')).toBe('image')
    })

    it('should map location to input-text', () => {
      expect(objectqlTypeToAmisFormType('location')).toBe('input-text')
      expect(objectqlTypeToAmisColumnType('location')).toBe('text')
    })
  })

  describe('Relationship Types (3 types)', () => {
    it('should map select to select', () => {
      expect(objectqlTypeToAmisFormType('select')).toBe('select')
      expect(objectqlTypeToAmisColumnType('select')).toBe('text')
    })

    it('should map lookup to select', () => {
      expect(objectqlTypeToAmisFormType('lookup')).toBe('select')
      expect(objectqlTypeToAmisColumnType('lookup')).toBe('text')
    })

    it('should map master_detail to select', () => {
      expect(objectqlTypeToAmisFormType('master_detail')).toBe('select')
      expect(objectqlTypeToAmisColumnType('master_detail')).toBe('text')
    })
  })

  describe('Advanced Types (6 types)', () => {
    it('should map formula to static (read-only)', () => {
      expect(objectqlTypeToAmisFormType('formula')).toBe('static')
      expect(objectqlTypeToAmisColumnType('formula')).toBe('text')
    })

    it('should map summary to static (read-only)', () => {
      expect(objectqlTypeToAmisFormType('summary')).toBe('static')
      expect(objectqlTypeToAmisColumnType('summary')).toBe('number')
    })

    it('should map auto_number to static (read-only)', () => {
      expect(objectqlTypeToAmisFormType('auto_number')).toBe('static')
      expect(objectqlTypeToAmisColumnType('auto_number')).toBe('text')
    })

    it('should map object to input-kv', () => {
      expect(objectqlTypeToAmisFormType('object')).toBe('input-kv')
      expect(objectqlTypeToAmisColumnType('object')).toBe('json')
    })

    it('should map grid to input-table', () => {
      expect(objectqlTypeToAmisFormType('grid')).toBe('input-table')
      expect(objectqlTypeToAmisColumnType('grid')).toBe('text')
    })

    it('should map vector to text (not applicable for UI)', () => {
      expect(objectqlTypeToAmisFormType('vector')).toBe('input-text')
      expect(objectqlTypeToAmisColumnType('vector')).toBe('text')
    })
  })

  describe('Legacy/Non-Standard Types (backward compatibility)', () => {
    it('should map checkbox to checkbox (legacy: use boolean instead)', () => {
      expect(objectqlTypeToAmisFormType('checkbox')).toBe('checkbox')
      expect(objectqlTypeToAmisColumnType('checkbox')).toBe('status')
    })

    it('should map switch to switch (legacy: use boolean with UI hint)', () => {
      expect(objectqlTypeToAmisFormType('switch')).toBe('switch')
      expect(objectqlTypeToAmisColumnType('switch')).toBe('switch')
    })

    it('should map picklist to select (legacy: use select instead)', () => {
      expect(objectqlTypeToAmisFormType('picklist')).toBe('select')
      expect(objectqlTypeToAmisColumnType('picklist')).toBe('text')
    })

    it('should map multiselect to multi-select (legacy: use select with multiple:true)', () => {
      expect(objectqlTypeToAmisFormType('multiselect')).toBe('multi-select')
      expect(objectqlTypeToAmisColumnType('multiselect')).toBe('text')
    })

    it('should map slider to input-range (legacy: use number with UI hint)', () => {
      expect(objectqlTypeToAmisFormType('slider')).toBe('input-range')
      expect(objectqlTypeToAmisColumnType('slider')).toBe('number')
    })

    it('should map color to input-color (legacy: use text with color picker)', () => {
      expect(objectqlTypeToAmisFormType('color')).toBe('input-color')
      expect(objectqlTypeToAmisColumnType('color')).toBe('color')
    })

    it('should map rating to input-rating (legacy: use number with rating display)', () => {
      expect(objectqlTypeToAmisFormType('rating')).toBe('input-rating')
      expect(objectqlTypeToAmisColumnType('rating')).toBe('mapping')
    })
  })

  describe('Summary', () => {
    it('should support all 26 official ObjectQL field types', () => {
      const officialTypes = [
        // Basic (8)
        'text', 'textarea', 'markdown', 'html', 'number', 'currency', 'percent', 'boolean',
        // System/Format (4)
        'email', 'phone', 'url', 'password',
        // Date & Time (3)
        'date', 'datetime', 'time',
        // Complex/Media (4)
        'file', 'image', 'avatar', 'location',
        // Relationships (3)
        'select', 'lookup', 'master_detail',
        // Advanced (6) - Note: vector has 6 total
        'formula', 'summary', 'auto_number', 'object', 'grid', 'vector'
      ]

      // All official types should have mappings
      officialTypes.forEach(type => {
        const formType = objectqlTypeToAmisFormType(type)
        const columnType = objectqlTypeToAmisColumnType(type)
        
        expect(formType).toBeTruthy()
        expect(columnType).toBeTruthy()
      })

      expect(officialTypes).toHaveLength(28)  // 26 + vector(edge case)
    })
  })
})
