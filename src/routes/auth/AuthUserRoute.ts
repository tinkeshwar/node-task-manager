import { AuthUserProfileResponseSchema, UserResponseSchema } from '../../schemas/User'
import { UnauthorizedErrorSchema, InternalServerErrorSchema, BadRequestErrorSchema } from '../../schemas/Common'
import ProfileController from '../../controllers/auth/ProfileController'
import Joi from 'joi'

const controller = new ProfileController()

export default [
  {
    path: '/api/auth/profile/profile',
    method: 'GET',
    handler: controller.profile.bind(controller),
    options: {
      description: 'Auth user profile',
      notes: 'Return auth user',
      tags: ['api', 'AuthUser'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false }
      },
      response: {
        status: {
          200: AuthUserProfileResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/auth/profile/change-password',
    method: 'POST',
    handler: controller.changePassword.bind(controller),
    options: {
      description: 'Auth user change password',
      notes: 'Return auth user change password success',
      tags: ['api', 'AuthUser'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        payload: {
          current_password: Joi.string().required(),
          new_password: Joi.string().required()
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
    path: '/api/auth/profile/change-profile',
    method: 'POST',
    handler: controller.changeProfile.bind(controller),
    options: {
      description: 'Auth user change profile',
      notes: 'Return auth user changed profile details',
      tags: ['api', 'AuthUser'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        payload: {
          firstname: Joi.string().required(),
          middlename: Joi.string().optional().allow(null).empty('').default(null),
          lastname: Joi.string().optional().allow(null).empty('').default(null),
          phone: Joi.string().required().example(9876543210),
          image: Joi.object({
            file: Joi.string().optional(),
            ext: Joi.string().optional()
          }).optional().empty('').allow(null)
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
  }
]
