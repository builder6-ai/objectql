import { describe, it, expect } from 'vitest'

describe('api client', () => {
  it('should export api client', async () => {
    const apiClient = await import('../utils/api')
    expect(apiClient.default).toBeDefined()
    expect(apiClient.default.get).toBeDefined()
    expect(apiClient.default.post).toBeDefined()
    expect(apiClient.default.patch).toBeDefined()
    expect(apiClient.default.delete).toBeDefined()
  })
})
