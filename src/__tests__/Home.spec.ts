import type { GetServerSidePropsContext } from 'next'
import { getServerSideProps } from '../pages'

const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const context = {} as GetServerSidePropsContext

describe('Home', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should redirect to the conversations when the user exists', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, nickname: 'Thibaut', token: 'xxxx' }],
    })

    await expect(getServerSideProps(context)).resolves.toEqual({
      redirect: { destination: '/conversations', permanent: false },
    })
  })

  it('should stay on the page when the user does not exist', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [] })

    await expect(getServerSideProps(context)).resolves.toEqual({ props: {} })
  })
})
