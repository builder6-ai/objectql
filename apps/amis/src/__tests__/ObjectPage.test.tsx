import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ObjectPage from '../pages/ObjectPage'
import apiClient from '../utils/api'

// Mock the API client
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

// Mock amis render function
vi.mock('amis', () => ({
  render: vi.fn((schema) => {
    const div = document.createElement('div')
    div.setAttribute('data-testid', 'amis-rendered')
    div.textContent = `Schema: ${schema.title}`
    return div
  }),
}))

// Mock auth client
vi.mock('../lib/auth', () => ({
  authClient: {
    getSession: vi.fn(() => Promise.resolve({ data: null })),
  },
}))

// Mock CSS imports
vi.mock('amis/lib/themes/cxd.css', () => ({}))
vi.mock('amis/lib/helper.css', () => ({}))
vi.mock('amis/sdk/iconfont.css', () => ({}))

// Mock AmisRenderer
vi.mock('../components/AmisRenderer', () => ({
  default: ({ schema }: any) => (
    <div data-testid="amis-rendered">Schema: {schema.title}</div>
  ),
}))

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: any) => <div>{children}</div>,
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}))

describe('ObjectPage', () => {
  const mockMetadata = {
    name: 'contacts',
    label: 'Contact',
    fields: {
      name: {
        type: 'text',
        label: 'Name',
        required: true,
      },
      email: {
        type: 'email',
        label: 'Email',
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    ;(apiClient.get as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <MemoryRouter initialEntries={['/object/contacts']}>
        <Routes>
          <Route path="/object/:objectName" element={<ObjectPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('should fetch and display object metadata', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockMetadata,
    })

    render(
      <MemoryRouter initialEntries={['/object/contacts']}>
        <Routes>
          <Route path="/object/:objectName" element={<ObjectPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('amis-rendered')).toBeInTheDocument()
    })

    expect(screen.getByText('Schema: Contact')).toBeInTheDocument()
  })

  it('should call API with correct endpoint', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: mockMetadata,
    })

    render(
      <MemoryRouter initialEntries={['/object/contacts']}>
        <Routes>
          <Route path="/object/:objectName" element={<ObjectPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/metadata/object/contacts')
    })
  })

  it('should display error message on API failure', async () => {
    ;(apiClient.get as any).mockRejectedValueOnce({
      response: {
        data: {
          message: 'Object not found',
        },
      },
    })

    render(
      <MemoryRouter initialEntries={['/object/contacts']}>
        <Routes>
          <Route path="/object/:objectName" element={<ObjectPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument()
      expect(screen.getByText('Object not found')).toBeInTheDocument()
    })
  })

  it('should display generic error message when API error has no message', async () => {
    ;(apiClient.get as any).mockRejectedValueOnce(new Error('Network error'))

    render(
      <MemoryRouter initialEntries={['/object/contacts']}>
        <Routes>
          <Route path="/object/:objectName" element={<ObjectPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument()
      expect(screen.getByText('加载对象元数据失败')).toBeInTheDocument()
    })
  })
})
