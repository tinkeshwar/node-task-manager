import Joi from 'joi'
import { StatusChangeSchema, TaskListResponseSchema, TaskResponseSchema } from '../../schemas/Task'
import TaskController from '../../controllers/task/TaskController'
import { InternalServerErrorSchema, UnauthorizedErrorSchema, BadRequestErrorSchema } from '../../schemas/Common'

const controller = new TaskController()

export default [
  {
    path: '/api/task/tasks',
    method: 'GET',
    handler: controller.list.bind(controller),
    config: {
      description: 'Tasks list',
      notes: 'Return a list of all tasks',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        query: {
          page: Joi.number().min(1).default(1),
          records: Joi.number().min(1).default(10),
          sort: Joi.string().optional(),
          order: Joi.string().optional()
        }
      },
      response: {
        status: {
          200: TaskListResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/tasks',
    method: 'POST',
    handler: controller.store.bind(controller),
    config: {
      description: 'Create Task',
      notes: 'Create new task in system',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        payload: {
          name: Joi.string().required().example('Test'),
          description: Joi.string().required().example('Task Description'),
          priority: Joi.number().required().example(1),
          deadline_at: Joi.date().optional().allow(null).empty(''),
          bucket_id: Joi.number().optional().allow(null).empty('')
        }
      },
      response: {
        status: {
          200: TaskResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/tasks/{id}',
    method: 'GET',
    handler: controller.show.bind(controller),
    config: {
      description: 'Get A Task',
      notes: 'Get a task details',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().example(1)
        }
      },
      response: {
        status: {
          200: TaskResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/tasks/{id}',
    method: 'PUT',
    handler: controller.update.bind(controller),
    config: {
      description: 'Update A Task',
      notes: 'Update a task details',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().example(1)
        },
        payload: {
          name: Joi.string().required().example('Test'),
          description: Joi.string().required().example('Task Description'),
          priority: Joi.number().required().example(1),
          deadline_at: Joi.date().optional().allow(null).empty(''),
          bucket_id: Joi.number().optional().allow(null).empty('')
        }
      },
      response: {
        status: {
          200: TaskResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/tasks/{id}',
    method: 'DELETE',
    handler: controller.destroy.bind(controller),
    config: {
      description: 'Delete A Task',
      notes: 'Delete a task from system',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().example(1)
        }
      },
      response: {
        status: {
          200: TaskResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/tasks/{id}',
    method: 'PATCH',
    handler: controller.status.bind(controller),
    config: {
      description: 'Complete Incomplete',
      notes: 'Mark task status complete incomplete task',
      tags: ['api', 'Task'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().example(1)
        }
      },
      response: {
        status: {
          200: StatusChangeSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  }
]
