import { User } from '../../models'
import { InvalidJWTError, InvalidTokenTypeError, UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from '../error'
import AuthService from './AuthService'
import { AuthUser } from './IFace'

class SignInService {
  public static async emailSignInProcess (email: string, password: string) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new UserNotExistError('Account Does Not Exist')
    }

    if (!user.status) {
      throw new UserNotActiveError('Account Suspended')
    }

    if (!user.emailVerifiedAt) {
      throw new UserNotActiveError('Email Not Verified')
    }

    const isValid = await user.authenticate(password)
    if (!isValid) {
      throw new UserInvalidCredentialError('Invalid Credentials')
    }

    return AuthService.authorize(user)
  }

  public static async refresh (refreshToken: string): Promise<AuthUser> {
    let decoded
    try {
      decoded = AuthService.refresh(refreshToken)
    } catch (error: any) {
      const err: Error = error
      throw new InvalidJWTError(err.message)
    }

    const { user: { id: userId }, tokenType } = decoded
    if (tokenType !== 'refresh') {
      throw new InvalidTokenTypeError('Only refresh tokens are accepted')
    }

    const user = await User.findByPk(userId)
    if (!user) {
      throw new UserNotExistError('User not found')
    }

    return AuthService.authorize(user)
  }
}

export default SignInService
