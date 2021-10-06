import Joi from 'joi'

export const InternalServerErrorSchema = Joi.object({
  statusCode: Joi.any().optional().example(500),
  error: Joi.any().example('Internal Server Error'),
  message: Joi.any().example('An internal server error occured')
}).label('Server Error')

export const BadRequestErrorSchema = Joi.object({
  statusCode: Joi.any().optional().example(400),
  error: Joi.any().example('Bad Request'),
  message: Joi.any().example('Missing Required Field.')
}).label('Bad Request Error')

export const ErrorAttribute = Joi.object({
  error: Joi.any().example('Token Invalid')
}).label('Attribute')

export const UnauthorizedErrorSchema = Joi.object({
  statusCode: Joi.any().optional().example(401),
  error: Joi.any().example('Unauthorized'),
  message: Joi.any().example('Missing authentication'),
  attributes: ErrorAttribute
}).label('Unauthorized Error')

export const StatusChangeSchema = Joi.object({
  success: Joi.any().example('Success'),
  status: Joi.boolean().required().example(true)
}).label('Unauthorized Error')

export const FileUploadSchema = Joi.object({
  file: Joi.string(),
  ext: Joi.string()
}).label('File Upload Success')

export const CPUHealthSchema = Joi.object({
  uptime: Joi.number(),
  timestamp: Joi.number(),
  cpu: Joi.object({
    idle: Joi.number(),
    total: Joi.number()
  }),
  usage: Joi.object({
    cpu: Joi.number(),
    memory: Joi.number(),
    ctime: Joi.number(),
    elapsed: Joi.number(),
    timestamp: Joi.number()
  })
}).label('CPU Health State')
