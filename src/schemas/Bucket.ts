import Joi from 'joi'

const date = new Date()

const BucketResponse = Joi.object({
  id: Joi.number().required().example(1),
  user_id: Joi.number().required().example(1),
  name: Joi.string().required().example('Test Bucket'),
  description: Joi.string().optional().allow(null).empty(''),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Bucket')

const BucketResponseList = Joi.object({
  list: Joi.array().items(BucketResponse).required().label('List Data'),
  meta: Joi.object({
    total: Joi.number().required().example(0),
    page: Joi.number().required().example(1),
    per_page: Joi.number().required().example(1)
  }).unknown().label('List Meta')
}).unknown().label('Bucket List')

const BucketDropdownResponseList = Joi.object({
  items: Joi.array().items(BucketResponse).required().label('List Dropdown')
}).unknown().label('Bucket Dropdown')

export const BucketListResponseSchema = BucketResponseList
export const BucketResponseSchema = BucketResponse
export const BucketDropdownListResponseSchema = BucketDropdownResponseList
