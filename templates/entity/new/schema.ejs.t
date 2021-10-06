---
to: src/schemas/<%= h.inflection.classify(name) %>.ts
---

import Joi from 'joi';

const date = new Date();

const <%= h.inflection.classify(name) %>Response = Joi.object({
    id: Joi.number().required().example(1),
    
    status:Joi.boolean().default(false),
    created_at:Joi.date().optional().allow(null).example(date),
    updated_at:Joi.date().optional().allow(null).example(date)
}).unknown().label('<%= h.inflection.classify(name) %>');

const <%= h.inflection.classify(name) %>ResponseList = Joi.object({
    list: Joi.array().items(<%= h.inflection.classify(name) %>Response).required().label('List Data'),
    meta:Joi.object({
        total:Joi.number().required().example(0),
        page:Joi.number().required().example(1),
        per_page:Joi.number().required().example(1)
    }).unknown().label('List Meta')
}).unknown().label('<%= h.inflection.classify(name) %> List');

export const <%= h.inflection.classify(name) %>ListResponseSchema = <%= h.inflection.classify(name) %>ResponseList
export const <%= h.inflection.classify(name) %>ResponseSchema = <%= h.inflection.classify(name) %>Response;