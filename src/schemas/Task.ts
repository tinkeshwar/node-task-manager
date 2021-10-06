import Joi from 'joi'

const date = new Date()

const TaskResponse = Joi.object({
  id: Joi.number().required().example(1),
  user_id: Joi.number().required().example(1),
  name: Joi.string().required().example('Test'),
  description: Joi.string().required().example('Task Description'),
  priority: Joi.number().required().example(1),
  sort: Joi.number().required().example(1),
  status: Joi.string().required().default('pending'),
  history: Joi.array().items(Joi.string().optional()).allow(null).label('History'),
  deadline_at: Joi.date().optional().allow(null).empty('').example(date),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Task')

export const StatusChangeSchema = Joi.object({
  success: Joi.any().example('Success'),
  status: Joi.string().required()
}).label('Unauthorized Error')

const TaskResponseList = Joi.object({
  list: Joi.array().items(TaskResponse).required().label('List Data'),
  meta: Joi.object({
    total: Joi.number().required().example(0),
    page: Joi.number().required().example(1),
    per_page: Joi.number().required().example(1)
  }).unknown().label('List Meta')
}).unknown().label('Task List')

export const TaskListResponseSchema = TaskResponseList
export const TaskResponseSchema = TaskResponse
