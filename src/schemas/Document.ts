import Joi from 'joi'

const date = new Date()

const DocumentResponse = Joi.object({
  id: Joi.number().required().example(1),
  name: Joi.string().required().example('ed4887af-d11f-4d57-8fcf-caa0f4607d2d.png'),
  path: Joi.string().required().example('upload/file'),
  document: Joi.string().required().example('dcument name'),
  public_url: Joi.string().example('static-files/ed4887af-d11f-4d57-8fcf-caa0f4607d2d.png'),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().optional().allow(null).label('Document')

export const DocumentResponseSchema = DocumentResponse
