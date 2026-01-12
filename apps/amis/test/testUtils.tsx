/**
 * Test utilities for AMIS application
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialRoute?: string
  }
) {
  const { initialRoute = '/', ...renderOptions } = options || {}

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        {children}
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock object metadata for testing
 */
export const mockObjectMetadata = {
  contacts: {
    name: 'contacts',
    label: 'Contact',
    icon: '👤',
    description: 'Contact records',
    fields: {
      first_name: {
        type: 'text',
        label: 'First Name',
        required: true,
        placeholder: 'Enter first name',
      },
      last_name: {
        type: 'text',
        label: 'Last Name',
        required: true,
      },
      email: {
        type: 'email',
        label: 'Email',
        required: true,
        unique: true,
      },
      phone: {
        type: 'phone',
        label: 'Phone',
      },
      age: {
        type: 'number',
        label: 'Age',
        min: 0,
        max: 150,
      },
      is_active: {
        type: 'checkbox',
        label: 'Active',
      },
      status: {
        type: 'select',
        label: 'Status',
        options: ['Active', 'Inactive', 'Pending'],
      },
      notes: {
        type: 'textarea',
        label: 'Notes',
        maxLength: 500,
      },
      created_at: {
        type: 'datetime',
        label: 'Created At',
      },
    },
  },
  orders: {
    name: 'orders',
    label: 'Order',
    fields: {
      order_number: {
        type: 'text',
        label: 'Order Number',
        required: true,
      },
      customer: {
        type: 'lookup',
        label: 'Customer',
        reference_to: 'contacts',
      },
      amount: {
        type: 'currency',
        label: 'Amount',
        precision: 2,
      },
      discount: {
        type: 'percent',
        label: 'Discount',
        min: 0,
        max: 100,
      },
      order_date: {
        type: 'date',
        label: 'Order Date',
      },
    },
  },
}

/**
 * Mock API responses
 */
export const mockApiResponses = {
  metadata: {
    objects: [
      { name: 'contacts', label: 'Contact', icon: '👤' },
      { name: 'orders', label: 'Order', icon: '📋' },
    ],
    contacts: mockObjectMetadata.contacts,
    orders: mockObjectMetadata.orders,
  },
  data: {
    contacts: [
      {
        _id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '13800138000',
        age: 30,
        is_active: true,
        status: 'Active',
      },
      {
        _id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        age: 25,
        is_active: true,
        status: 'Active',
      },
    ],
    orders: [
      {
        _id: '1',
        order_number: 'ORD-001',
        customer: '1',
        amount: 1000,
        discount: 10,
        order_date: '2024-01-01',
      },
    ],
  },
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Create mock user session
 */
export const mockUserSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  session: {
    id: 'session-1',
    userId: '1',
    activeOrganizationId: 'org-1',
  },
}
