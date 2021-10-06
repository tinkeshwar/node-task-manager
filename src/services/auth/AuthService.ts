import JWT from 'jsonwebtoken'
import { User } from '../../models'
import { AuthUser, AuthUserJWT, AuthUserJWTVerify, ResetToken } from './IFace'

const { NODE_ENV, JWT_TOKEN } = process.env

function getJWTExpireTime () {
  switch (NODE_ENV) {
    case 'development':
      return '1y'
    case 'testing':
      return '24h'
    default:
      return '30m'
  }
}

class AuthService {
  public static async authorize (user: User): Promise<AuthUser> {
    const token = JWT.sign({
      user,
      tokenType: 'access'
    }, JWT_TOKEN as string, {
      algorithm: 'HS256',
      expiresIn: getJWTExpireTime()
    })
    const refresh = JWT.sign({
      user,
      tokenType: 'refresh'
    }, JWT_TOKEN as string, {
      algorithm: 'HS256',
      expiresIn: '14d'
    })
    return {
      user,
      token,
      refresh
    }
  }

  public static refresh (token: string): AuthUserJWT {
    const payload = JWT.verify(token, JWT_TOKEN as string)
    if (typeof payload !== 'object') {
      throw new Error('JWT payload is not an object')
    }

    const objectPayload: AuthUserJWT = payload as any
    if (!objectPayload.tokenType) {
      throw new Error('Malformed JWT payload')
    }
    return objectPayload
  }

  public static async verify (toVerify: AuthUserJWT): Promise<AuthUserJWTVerify> {
    const { user, tokenType } = toVerify

    if (tokenType !== 'access') {
      return { isValid: false }
    }
    return { isValid: true, credentials: { user } }
  }

  public static async sendVerificationToken (user: User):Promise<ResetToken> {
    return { name: user.firstname as string, email: '' }
  }
}

export default AuthService
