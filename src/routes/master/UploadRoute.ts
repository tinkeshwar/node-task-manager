
import Joi from 'joi'
import { BadRequestErrorSchema, FileUploadSchema, InternalServerErrorSchema, UnauthorizedErrorSchema } from '../../schemas/Common'
import UploadController from '../../controllers/master/UploadController'
import path from 'path'

const controller = new UploadController()

export default [
  {
    path: '/static/image/{param*}',
    method: 'GET',
    handler: {
      directory: {
        path: path.join(__dirname, '..', '..', '..', 'static/image/')
      }
    }
  },
  {
    path: '/static/file/{param*}',
    method: 'GET',
    handler: {
      directory: {
        path: path.join(__dirname, '..', '..', '..', 'static/file/')
      }
    }
  },
  {
    path: '/api/common/upload/image',
    method: 'POST',
    handler: controller.image.bind(controller),
    options: {
      description: 'Upload Single Image',
      notes: 'Return a object of uploaded file',
      tags: ['api', 'Common'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.create' || 'student_registrations.create' || 'students.update' }
      },
      validate: {
        options: { abortEarly: false }
      },
      payload: {
        maxBytes: 10240000,
        parse: false,
        timeout: false as const,
        output: 'stream' as const,
        allow: 'multipart/form-data'
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          validate: {
            payload: {
              image: Joi.any().meta({ swaggerType: 'file' }).description('file to upload')
            }
          }
        }
      },
      response: {
        status: {
          200: FileUploadSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/common/upload/file',
    method: 'POST',
    handler: controller.file.bind(controller),
    options: {
      description: 'Upload Single File',
      notes: 'Return a object of uploaded file',
      tags: ['api', 'Common'],
      auth: {
        strategy: 'token',
        access: { scope: 'students.update' }
      },
      validate: {
        options: { abortEarly: false }
      },
      payload: {
        maxBytes: 10240000,
        parse: false,
        timeout: false as const,
        output: 'stream' as const,
        allow: 'multipart/form-data'
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          validate: {
            payload: {
              file: Joi.any().meta({ swaggerType: 'file' }).description('file to upload')
            }
          }
        }
      },
      response: {
        status: {
          200: FileUploadSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  }
]
