# Testing Guide for AMIS Application

## Overview

This document describes the testing infrastructure and test suites for the ObjectOS AMIS application.

## Test Framework

- **Test Runner**: Vitest 2.1.8
- **Test Library**: @testing-library/react 16.3.1
- **DOM Assertions**: @testing-library/jest-dom 6.9.1
- **Coverage Provider**: v8

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

```
apps/amis/
├── src/__tests__/          # Unit and integration tests
│   ├── schemaBuilder.test.ts      # Schema conversion tests
│   ├── AmisRenderer.test.tsx      # Component tests
│   ├── ObjectPage.test.tsx        # Page component tests
│   ├── api.test.ts                # API client tests
│   └── integration.test.tsx       # Integration tests
├── test/
│   ├── setup.ts            # Test setup and configuration
│   └── testUtils.tsx       # Test utilities and helpers
└── vitest.config.ts        # Vitest configuration
```

## Test Suites

### 1. Schema Builder Tests (`schemaBuilder.test.ts`)

Tests the ObjectQL to AMIS schema conversion logic.

**Coverage:**
- Field type mapping (form and table)
- CRUD schema generation
- Column configuration
- Form field configuration
- Validation rules
- Field options and lookups
- Pagination settings
- Bulk actions

**Key Test Cases:**
- ✅ 30 tests covering all field types
- ✅ Form type mappings
- ✅ Table column type mappings  
- ✅ Required field handling
- ✅ Min/max validation
- ✅ Select field options
- ✅ Lookup field configuration
- ✅ Currency and percent formatting

### 2. AMIS Renderer Tests (`AmisRenderer.test.tsx`)

Tests the core AMIS rendering component.

**Coverage:**
- Component rendering
- Schema passing to AMIS
- Data context handling
- User context injection

**Key Test Cases:**
- ✅ 4 tests for component behavior
- ✅ Renders without crashing
- ✅ Passes schema to AMIS correctly
- ✅ Merges custom data
- ✅ Includes user in context

### 3. Object Page Tests (`ObjectPage.test.tsx`)

Tests the dynamic object page component.

**Coverage:**
- Loading states
- Metadata fetching
- Error handling
- Schema rendering

**Key Test Cases:**
- ✅ 5 tests for page lifecycle
- ✅ Shows loading spinner
- ✅ Fetches metadata from API
- ✅ Calls correct API endpoint
- ✅ Displays error messages
- ✅ Handles network errors

### 4. API Client Tests (`api.test.ts`)

Tests the Axios API client configuration.

**Coverage:**
- API client exports
- HTTP methods availability

**Key Test Cases:**
- ✅ 1 test for API client structure
- ✅ Verifies all HTTP methods exist

### 5. Integration Tests (`integration.test.tsx`)

Tests the complete workflow from routing to rendering.

**Coverage:**
- Full page loading flow
- Metadata to schema conversion
- Multiple object types
- Error scenarios
- Route changes

**Key Test Cases:**
- ✅ 6 integration tests
- ✅ Loads contacts object page
- ✅ Generates correct column count
- ✅ Generates correct form fields
- ✅ Handles lookup fields
- ✅ Graceful error handling
- ✅ Refetches on route change

## Test Utilities

### Mock Data (`test/testUtils.tsx`)

Provides reusable mock data for tests:

```typescript
import { mockObjectMetadata, mockApiResponses } from '@/test/testUtils'

// Use in tests
const contactsMeta = mockObjectMetadata.contacts
const contactsData = mockApiResponses.data.contacts
```

### Custom Render

```typescript
import { renderWithProviders } from '@/test/testUtils'

// Renders with MemoryRouter
renderWithProviders(<YourComponent />, {
  initialRoute: '/object/contacts'
})
```

## Mocking Strategy

### AMIS Framework

```typescript
vi.mock('amis', () => ({
  render: vi.fn((schema, props) => {
    return null // AMIS renders directly to DOM
  }),
}))
```

### API Client

```typescript
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))
```

### CSS Imports

```typescript
vi.mock('amis/lib/themes/cxd.css', () => ({}))
vi.mock('amis/lib/helper.css', () => ({}))
vi.mock('amis/sdk/iconfont.css', () => ({}))
```

## Coverage Goals

| Area | Current | Goal |
|------|---------|------|
| Statements | TBD | 80% |
| Branches | TBD | 75% |
| Functions | TBD | 80% |
| Lines | TBD | 80% |

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: Mock API calls, AMIS framework
3. **Test User Behavior**: Focus on what users do, not implementation
4. **Descriptive Names**: Test names should clearly describe what they test
5. **Arrange-Act-Assert**: Follow AAA pattern in test structure

## Example Test

```typescript
describe('Feature', () => {
  it('should do something when condition is met', async () => {
    // Arrange
    const mockData = { foo: 'bar' }
    ;(apiClient.get as any).mockResolvedValueOnce({ data: mockData })

    // Act
    renderWithProviders(<Component />, { initialRoute: '/test' })

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })
  })
})
```

## Common Issues

### Tests Timing Out

If tests timeout, increase the wait time:

```typescript
await waitFor(
  () => {
    expect(screen.getByText('Text')).toBeInTheDocument()
  },
  { timeout: 5000 } // 5 seconds
)
```

### Mock Not Working

Ensure mocks are defined before imports:

```typescript
// ✅ Good - Mock first
vi.mock('../utils/api')
import apiClient from '../utils/api'

// ❌ Bad - Import first
import apiClient from '../utils/api'
vi.mock('../utils/api')
```

### CSS Import Errors

Always mock CSS imports:

```typescript
vi.mock('amis/lib/themes/cxd.css', () => ({}))
```

## Future Test Additions

- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests
- [ ] API integration tests with real server

## Test Statistics

- **Total Test Files**: 5
- **Total Tests**: 46
- **Passing**: 46 (100%)
- **Failing**: 0
- **Average Duration**: ~2.5s

## Continuous Integration

Tests are run automatically on:
- Every commit
- Every pull request
- Before deployment

All tests must pass before merging to main branch.
