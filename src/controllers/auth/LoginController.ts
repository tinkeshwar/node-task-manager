import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import { InvalidJWTError, InvalidTokenTypeError, UserAlreadyExistError, UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from '../../services/error'
import SignInService from '../../services/auth/SignInService'
import { User } from '../../models'
import { PasswordRecoveryService } from '../../services/auth'
import SignUpService from '../../services/auth/SignUpService'

class LoginController {
  async register (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { name, email, password, phone } = request.payload as any
      const user = await SignUpService.register(name, email, password, phone)
      return response.response(user)
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case UserAlreadyExistError:
          return Boom.conflict(err.message)
      }
      return Boom.internal('Something is not right, please try again later.')
    }
  }

  async verification (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { verification_token: verficationToken, verification_code: verficationCode } = request.payload as any
      const user = await SignUpService.verify(verficationToken, verficationCode)
      return response.response(user)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async resendVerification (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { email } = request.payload as any
      const user = await SignUpService.sendVerification(email)
      return response.response(user)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async login (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { email, password } = request.payload as any
      const authUser = await SignInService.emailSignInProcess(email, password)
      return response.response(authUser)
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case UserNotExistError:
          return Boom.notFound('Account Not Found')
        case UserNotActiveError:
          return Boom.forbidden(err.message)
        case UserInvalidCredentialError:
          return Boom.unauthorized('Invalid Credentials')
      }
      return Boom.unauthorized('Invalid Credentials')
    }
  }

  async refresh (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
    try {
      const { refresh } = request.payload as any
      const authData = await SignInService.refresh(refresh)
      return response.response(authData)
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case InvalidJWTError:
        case UserNotExistError:
          throw Boom.unauthorized(err.message)
        case InvalidTokenTypeError:
          throw Boom.badRequest(err.message)
      }
      throw err
    }
  }

  async forgot (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { email } = request.payload as any
      const user = await User.findOne({ where: { email, status: true } })
      if (user) {
        const recovery = await PasswordRecoveryService.requestRecovery({ email })
        return response.response({ expires_at: recovery.expiresAt })
      }
      return Boom.notFound('Email address not found.')
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async reset (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { recovery_token: recoveryToken, verfication_code: verficationCode, password } = request.payload as any
      const recovered = await PasswordRecoveryService.recover(recoveryToken, verficationCode, password)
      return response.response(recovered)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }
}
export default LoginController
