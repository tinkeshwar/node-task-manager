import { expect } from 'chai'
import { server } from '../../src/config/server'

// eslint-disable-next-line no-undef
describe('[HEALTH API INTEGRATION] Server tests', () => {
  it('Basic server test should pass', async () => {
    expect(1).equal(1)
  })

  it('Basic default test should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).equal(200)
  })
})
