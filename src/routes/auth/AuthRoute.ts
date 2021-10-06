import Joi from 'joi'
import { AuthUserResponseSchema, PasswordRecoveryResponseSchema, PasswordResetResponseSchema, RegisteredUserResponseSchema, UserResponseSchema } from '../../schemas/User'
import LoginController from '../../controllers/auth/LoginController'
import { UnauthorizedErrorSchema, InternalServerErrorSchema, BadRequestErrorSchema } from '../../schemas/Common'

const controller = new LoginController()

export default [
  {
    path: '/api/auth/user/register',
    method: 'POST',
    handler: controller.register.bind(controller),
    options: {
      description: 'Register User',
      notes: 'Register user into system',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          name: Joi.string().required(),
          phone: Joi.number().required()
        }
      },
      response: {
        status: {
          200: RegisteredUserResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/account-verification',
    method: 'POST',
    handler: controller.verification.bind(controller),
    options: {
      description: 'Verify Account',
      notes: 'Verify user account',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          verification_token: Joi.string().uuid().required().example('b3e0a663-ddeb-4aaa-8634-24d1ac42d0a3'),
          verification_code: Joi.string().required().example('FSAYXY')
        }
      },
      response: {
        status: {
          200: UserResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/resend-verification',
    method: 'POST',
    handler: controller.resendVerification.bind(controller),
    options: {
      description: 'Resend Verification Token',
      notes: 'Verify user account, resend token',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          email: Joi.string().email().required()
        }
      },
      response: {
        status: {
          200: UserResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/login',
    method: 'POST',
    handler: controller.login.bind(controller),
    options: {
      description: 'Login User',
      notes: 'Login user into system',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      response: {
        status: {
          200: AuthUserResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/forget-password',
    method: 'POST',
    handler: controller.forgot.bind(controller),
    options: {
      description: 'Forget password',
      notes: 'Reset password by requesting reset link',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          email: Joi.string().email().required()
        }
      },
      response: {
        status: {
          200: PasswordRecoveryResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/reset-password',
    method: 'POST',
    handler: controller.reset.bind(controller),
    options: {
      description: 'Reset password',
      notes: 'Change password by clicking reset link',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          recovery_token: Joi.string().uuid().required().example('b3e0a663-ddeb-4aaa-8634-24d1ac42d0a3'),
          verfication_code: Joi.string().required().example('FSAYXY'),
          password: Joi.string().required().example('sample')
        }
      },
      response: {
        status: {
          200: PasswordResetResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/user/refresh',
    method: 'POST',
    handler: controller.refresh.bind(controller),
    options: {
      description: 'Refresh session',
      notes: 'Return auth user new token',
      tags: ['api', 'Auth'],
      validate: {
        options: { abortEarly: false },
        payload: {
          refresh: Joi.string().required()
        }
      },
      response: {
        status: {
          200: AuthUserResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  }
]
