import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, mockApiResponses } from '../../test/testUtils'
import ObjectPage from '../pages/ObjectPage'
import apiClient from '../utils/api'
import { Routes, Route } from 'react-router-dom'

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('amis', () => ({
  render: vi.fn((schema) => {
    const div = document.createElement('div')
    div.setAttribute('data-testid', 'amis-rendered')
    div.setAttribute('data-schema-title', schema.title)
    return div
  }),
}))

vi.mock('amis/lib/themes/cxd.css', () => ({}))
vi.mock('amis/lib/helper.css', () => ({}))
vi.mock('amis/sdk/iconfont.css', () => ({}))

vi.mock('../components/AmisRenderer', () => ({
  default: ({ schema }: any) => (
    <div data-testid="amis-rendered" data-schema-title={schema.title}>
      <div data-testid="table-columns">{schema.body.columns.length} columns</div>
      <div data-testid="form-fields">
        {schema.body.headerToolbar.find((t: any) => t.label === '新建')?.dialog.body.body.length} form fields
      </div>
    </div>
  ),
}))

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: any) => <div>{children}</div>,
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', name: 'Test User' },
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}))

describe('ObjectPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load and render contacts object page', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockApiResponses.metadata.contacts,
    })

    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/contacts' }
    )

    // Should show loading state
    expect(screen.getByText('加载中...')).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('amis-rendered')).toBeInTheDocument()
    })

    // Verify API was called correctly
    expect(apiClient.get).toHaveBeenCalledWith('/metadata/object/contacts')

    // Verify schema title
    expect(screen.getByTestId('amis-rendered')).toHaveAttribute(
      'data-schema-title',
      'Contact'
    )
  })

  it('should generate correct number of columns for contacts', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockApiResponses.metadata.contacts,
    })

    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/contacts' }
    )

    await waitFor(() => {
      expect(screen.getByTestId('table-columns')).toBeInTheDocument()
    })

    // Should have 9 fields + 1 operation column = 10 columns
    expect(screen.getByTestId('table-columns')).toHaveTextContent('10 columns')
  })

  it('should generate correct number of form fields for contacts', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockApiResponses.metadata.contacts,
    })

    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/contacts' }
    )

    await waitFor(() => {
      expect(screen.getByTestId('form-fields')).toBeInTheDocument()
    })

    // Should have 9 form fields
    expect(screen.getByTestId('form-fields')).toHaveTextContent('9 form fields')
  })

  it('should load and render orders object page with lookup field', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockApiResponses.metadata.orders,
    })

    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/orders' }
    )

    await waitFor(() => {
      expect(screen.getByTestId('amis-rendered')).toBeInTheDocument()
    })

    expect(screen.getByTestId('amis-rendered')).toHaveAttribute(
      'data-schema-title',
      'Order'
    )
  })

  it('should handle API error gracefully', async () => {
    const errorMessage = 'Failed to load metadata'
    ;(apiClient.get as any).mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/invalid' }
    )

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument()
    })

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should refetch metadata when object name changes', async () => {
    ;(apiClient.get as any)
      .mockResolvedValueOnce({ data: mockApiResponses.metadata.contacts })
      .mockResolvedValueOnce({ data: mockApiResponses.metadata.orders })

    const { rerender } = renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/contacts' }
    )

    await waitFor(() => {
      expect(screen.getByTestId('amis-rendered')).toBeInTheDocument()
    })

    expect(apiClient.get).toHaveBeenCalledTimes(1)
    expect(apiClient.get).toHaveBeenCalledWith('/metadata/object/contacts')

    // Navigate to different object
    renderWithProviders(
      <Routes>
        <Route path="/object/:objectName" element={<ObjectPage />} />
      </Routes>,
      { initialRoute: '/object/orders' }
    )

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledTimes(2)
    })

    expect(apiClient.get).toHaveBeenCalledWith('/metadata/object/orders')
  })
})
