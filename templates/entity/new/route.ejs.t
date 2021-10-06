---
to: src/routes/<%= h.inflection.classify(name) %>Route.ts
---

import Joi from 'joi';
import { <%= h.inflection.classify(name) %>ListResponseSchema, <%= h.inflection.classify(name) %>ResponseSchema } from '../schemas/<%= h.inflection.classify(name) %>';
import <%= h.inflection.classify(name) %>Controller from '../controllers/<%= h.inflection.classify(name) %>Controller';
import { InternalServerErrorSchema, UnauthorizedErrorSchema, StatusChangeSchema, BadRequestErrorSchema } from '../schemas/Common';

const controller = new <%= h.inflection.classify(name) %>Controller();

export default[
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>',
        method: 'GET',
        handler: controller.list.bind(controller),
        config: {
            description: '<%= h.inflection.humanize(h.inflection.underscore(h.inflection.pluralize(name))) %> list',
            notes: 'Return a list of all <%= h.inflection.humanize(h.inflection.underscore(h.inflection.pluralize(name)), true) %>',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
                query:{
                    page: Joi.number().min(1).default(1),
                    records: Joi.number().min(1).default(10),
                    sort: Joi.string().optional(),
                    order: Joi.string().optional()
                }
            },
            response: {
                status: {
                    200:<%= h.inflection.classify(name) %>ListResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>',
        method: 'POST',
        handler: controller.store.bind(controller),
        config: {
            description: 'Create <%= h.inflection.classify(name) %>',
            notes: 'Create new <%= h.inflection.humanize(h.inflection.underscore(name), true) %> in system',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
            },
            response: {
                status: {
                    200:<%= h.inflection.classify(name) %>ResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>/{id}',
        method: 'GET',
        handler: controller.show.bind(controller),
        config: {
            description: 'Get A <%= h.inflection.classify(name) %>',
            notes: 'Get a <%= h.inflection.humanize(h.inflection.underscore(name), true) %> details',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
            },
            response: {
                status: {
                    200:<%= h.inflection.classify(name) %>ResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>/{id}',
        method: 'PUT',
        handler: controller.update.bind(controller),
        config: {
            description: 'Update A <%= h.inflection.classify(name) %>',
            notes: 'Update a <%= h.inflection.humanize(h.inflection.underscore(name), true) %> details',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
            },
            response: {
                status: {
                    200:<%= h.inflection.classify(name) %>ResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>/{id}',
        method: 'DELETE',
        handler: controller.destroy.bind(controller),
        config: {
            description: 'Delete A <%= h.inflection.classify(name) %>',
            notes: 'Delete a <%= h.inflection.humanize(h.inflection.underscore(name), true) %> from system',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
            },
            response: {
                status: {
                    200:<%= h.inflection.classify(name) %>ResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>/{id}',
        method: 'PATCH',
        handler: controller.status.bind(controller),
        config: {
            description: 'Activate Deactivate',
            notes: 'Enable-disable <%= h.inflection.humanize(h.inflection.underscore(name), true) %>',
            tags: ['api', '<%= h.inflection.classify(h.inflection.pluralize(name)) %>'],
            auth: {
                strategy: 'token'
            },
            validate: {
                options: {abortEarly: false},
            },
            response: {
                status: {
                    200: StatusChangeSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    }
]