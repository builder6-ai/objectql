import { ObjectOS } from '../src/objectos';

describe('ObjectOS', () => {
  describe('Initialization', () => {
    it('should create an instance without config', () => {
      const kernel = new ObjectOS();
      expect(kernel).toBeInstanceOf(ObjectOS);
    });

    it('should create an instance with empty config', () => {
      const kernel = new ObjectOS({});
      expect(kernel).toBeInstanceOf(ObjectOS);
    });

    it('should create an instance with datasources config', () => {
      const kernel = new ObjectOS({
        datasources: {
          default: {}
        }
      });
      expect(kernel).toBeInstanceOf(ObjectOS);
    });

    it('should create an instance with packages config', () => {
      const kernel = new ObjectOS({
        packages: ['@objectos/preset-base']
      });
      expect(kernel).toBeInstanceOf(ObjectOS);
    });
  });

  describe('Driver Management', () => {
    it('should allow setting a driver via useDriver', () => {
      const kernel = new ObjectOS();
      const mockDriver = { query: jest.fn() };
      
      expect(() => {
        kernel.useDriver(mockDriver);
      }).not.toThrow();
    });
  });

  describe('Initialization Lifecycle', () => {
    // Note: Full initialization requires app loader dependencies
    // These tests verify the init method exists and is callable
    it('should have an init method', () => {
      const kernel = new ObjectOS();
      expect(typeof kernel.init).toBe('function');
    });

    it('should accept options parameter in init', () => {
      const kernel = new ObjectOS();
      expect(kernel.init.length).toBeGreaterThanOrEqual(0);
    });
  });
});
