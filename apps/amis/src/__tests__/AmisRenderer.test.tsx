import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import * as amisModule from 'amis'

// Mock amis render function
vi.mock('amis', () => ({
  render: vi.fn((schema, props) => {
    return null // AMIS renders directly to DOM
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

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    loading: false,
  }),
}))

describe('AmisRenderer', () => {
  const mockSchema = {
    type: 'page',
    title: 'Test Page',
    body: {
      type: 'form',
      body: [
        {
          type: 'input-text',
          name: 'name',
          label: 'Name',
        },
      ],
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', async () => {
    const AmisRenderer = (await import('../components/AmisRenderer')).default
    const { container } = render(<AmisRenderer schema={mockSchema} />)
    expect(container).toBeTruthy()
  })

  it('should call AMIS render with schema', async () => {
    const AmisRenderer = (await import('../components/AmisRenderer')).default
    render(<AmisRenderer schema={mockSchema} />)

    expect(amisModule.render).toHaveBeenCalledWith(
      mockSchema,
      expect.objectContaining({
        data: expect.any(Object),
      })
    )
  })

  it('should pass custom data to AMIS render', async () => {
    const AmisRenderer = (await import('../components/AmisRenderer')).default
    const customData = { foo: 'bar' }
    
    render(<AmisRenderer schema={mockSchema} data={customData} />)

    expect(amisModule.render).toHaveBeenCalledWith(
      mockSchema,
      expect.objectContaining({
        data: expect.objectContaining({
          foo: 'bar',
        }),
      })
    )
  })

  it('should include user in context data', async () => {
    const AmisRenderer = (await import('../components/AmisRenderer')).default
    render(<AmisRenderer schema={mockSchema} />)

    expect(amisModule.render).toHaveBeenCalledWith(
      mockSchema,
      expect.objectContaining({
        data: expect.objectContaining({
          currentUser: expect.objectContaining({
            id: '1',
            email: 'test@example.com',
          }),
        }),
      })
    )
  })
})
