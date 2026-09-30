import { fetchJson, get } from '../api'

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch


const API_URL = 'http://localhost:3005'

const jsonResponse = (body: unknown, init: { ok?: boolean; status?: number } = {}) => ({
  ok: init.ok ?? true,
  status: init.status ?? 200,
  json: async () => body,
})

describe('api client', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should prefix the path with the API base url', async () => {
    mockFetch.mockResolvedValue(jsonResponse([]))

    await fetchJson('/conversations/1')

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/conversations/1`, undefined)
  })

  it('should return the parsed json body', async () => {
    const expected = [{ id: 1 }]
    mockFetch.mockResolvedValue(jsonResponse(expected))

    await expect(get('/conversations/1')).resolves.toEqual(expected)
  })

  it('should reject when the response status is not ok', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}, { ok: false, status: 503 }))

    await expect(get('/conversations/1')).rejects.toThrow('failed with status 503')
  })
})
