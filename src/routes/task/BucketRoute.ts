import Joi from 'joi'
import { BucketDropdownListResponseSchema, BucketListResponseSchema, BucketResponseSchema } from '../../schemas/Bucket'
import BucketController from '../../controllers/task/BucketController'
import { InternalServerErrorSchema, UnauthorizedErrorSchema, StatusChangeSchema, BadRequestErrorSchema } from '../../schemas/Common'

const controller = new BucketController()

export default [
  {
    path: '/api/task/buckets',
    method: 'GET',
    handler: controller.list.bind(controller),
    config: {
      description: 'Task buckets list',
      notes: 'Return a list of all task buckets',
      tags: ['api', 'Bucket'],
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
          200: BucketListResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/buckets',
    method: 'POST',
    handler: controller.store.bind(controller),
    config: {
      description: 'Create Bucket',
      notes: 'Create new task bucket in system',
      tags: ['api', 'Bucket'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        payload: {
          name: Joi.string().required().example('Test'),
          description: Joi.string().optional().allow(null).empty('').example('Task Description')
        }
      },
      response: {
        status: {
          200: BucketResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/buckets/{id}',
    method: 'GET',
    handler: controller.show.bind(controller),
    config: {
      description: 'Get A Bucket',
      notes: 'Get a task bucket details',
      tags: ['api', 'Bucket'],
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
          200: BucketResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/buckets/{id}',
    method: 'PUT',
    handler: controller.update.bind(controller),
    config: {
      description: 'Update A Bucket',
      notes: 'Update a task bucket details',
      tags: ['api', 'Bucket'],
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
          description: Joi.string().optional().allow(null).empty('').example('Task Description')
        }
      },
      response: {
        status: {
          200: BucketResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/buckets/{id}',
    method: 'DELETE',
    handler: controller.destroy.bind(controller),
    config: {
      description: 'Delete A Bucket',
      notes: 'Delete a task bucket from system',
      tags: ['api', 'Bucket'],
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
          200: BucketResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  },
  {
    path: '/api/task/buckets/{id}',
    method: 'PATCH',
    handler: controller.status.bind(controller),
    config: {
      description: 'Activate Deactivate',
      notes: 'Enable-disable task bucket',
      tags: ['api', 'Bucket'],
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
  },
  {
    path: '/api/task/buckets/dropdown',
    method: 'GET',
    handler: controller.dropdown.bind(controller),
    config: {
      description: 'Task buckets dropdown',
      notes: 'Return a list of all active buckets',
      tags: ['api', 'Bucket'],
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false },
        query: {
          sort: Joi.string().default('name'),
          order: Joi.string().default('ASC')
        }
      },
      response: {
        status: {
          200: BucketDropdownListResponseSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalServerErrorSchema
        }
      }
    }
  }
]
