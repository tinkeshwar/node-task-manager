import { expect } from 'chai'
import { server } from '../../../src/config/server'

describe('[AUTH API INTEGRATION] Auth tests', () => {
  it('Sign in using email and password should pass', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/user/login',
      payload: {
        email: (global as any).superadmin.email,
        password: (global as any).superadmin.password
      }
    })
    const resObj = JSON.parse(res.payload)
    expect(res.statusCode).equal(200)
    expect(resObj.token).to.be.a('string')
    expect(resObj.refresh).to.be.a('string')
  })

  it('Request user profile after login should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/auth/profile/profile',
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Request access token from refreh token should pass', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/user/refresh',
      payload: {
        refresh: (global as any).refreshToken
      }
    })
    const resObj = JSON.parse(res.payload)
    expect(res.statusCode).equal(200)
    expect(resObj.token).to.be.a('string')
    expect(resObj.refresh).to.be.a('string')
  })

  it('Request password reset should pass', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/user/forget-password',
      payload: {
        email: (global as any).superadmin.email
      }
    })
    const resObj = JSON.parse(res.payload)
    expect(res.statusCode).equal(200)
    expect(resObj.expires_at).to.be.a('string')
  })

  it('Request change password should pass', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/user/reset-password',
      payload: {
        recovery_token: 'b3e0a663-ddeb-4aaa-8634-24d1ac42d0a3',
        verfication_code: 'FSAYXY',
        password: 'sample'
      }
    })
    const resObj = JSON.parse(res.payload)
    expect(res.statusCode).equal(403)
    expect(resObj.message).to.be.a('string')
    expect(resObj.message).equal('Password recovery record does not exist')
  })
})
