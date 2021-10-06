import _ from 'lodash'
import * as Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import camelCaseKeys from 'camelcase-keys'
import camelcase from 'camelcase'
import { FindAndCountOptions, Model, Op, OrderItem, WhereAttributeHash } from 'sequelize'

interface IMasterControllerOptions {
    id: string | Record<string, string>;
    searchBy: string[];
    createWith?: string[];
    updateWith?: string[];
    included?: string[];
    sortBy?: string[];
    uniqueBy?: string[];
    permittedFilterOps?: Record<string, any>;
}

const defaultOptions = {
  id: 'id',
  searchBy: [] as string[],
  permittedFilterOps: {
    eq: Op.eq,
    ne: Op.ne,
    lt: Op.lt,
    lte: Op.lte,
    gt: Op.gt,
    gte: Op.gte,
    like: Op.like,
    ilike: Op.iLike,
    contains: Op.contains,
    in: Op.in
  }
}

type ModelStatic = typeof Model & (new () => Model);

abstract class MasterController<T extends ModelStatic> {
  static set options (value: IMasterControllerOptions) {
    this.internalOptions = _.defaults(value, _.cloneDeep(defaultOptions))
  }

  static get options (): IMasterControllerOptions {
    if (!this.internalOptions) {
      this.internalOptions = _.cloneDeep(defaultOptions)
    }
    return this.internalOptions
  }

    protected static internalOptions: IMasterControllerOptions;

    protected model: T;

    constructor (model: T) {
      this.model = model
    }

    public get options (): IMasterControllerOptions {
      return (this.constructor as typeof MasterController).options
    }

    async isUnique (request: Hapi.Request, edit?: any): Promise<boolean|number> {
      const { uniqueBy } = this.options
      const payload = request.payload
      if (uniqueBy !== undefined && uniqueBy.length > 0) {
        const uniqueRawData = (_.pick(payload as Record<string, any>, uniqueBy)) as Record<string, any>
        const uniqueData = camelCaseKeys(uniqueRawData) as Record<string, any>
        if (edit !== undefined) {
          const { id } = edit as any
          return await this.model.count({
            where: {
              [Op.and]: [uniqueData],
              [Op.not]: [{ id }]
            } as any
          }) as any
        }
        return await this.model.count({ where: uniqueData })
      }
      return false
    }

    async preList (request: Hapi.Request): Promise<FindAndCountOptions> {
      const { user } = request.auth.credentials as any
      const { searchBy, included, sortBy } = this.options
      const { page, records, sort, order }: { page: number; records: number; sort: string; order: 'ASC' | 'desc';} = request.query as any
      const queryObject = {
        where: this.processSearchFilters(_.pick(request.query, searchBy)) as WhereAttributeHash,
        offset: records * (page - 1),
        limit: records,
        order: [sortBy] as OrderItem[],
        paranoid: Boolean(request.query.all === undefined),
        include: included,
        distinct: true
      }
      if (sort !== undefined && order !== undefined) {
        queryObject.order = [[camelcase(sort), order.toUpperCase()]]
      }
      if (included !== undefined && included.length === 0) {
        delete queryObject.include
      }
      if (user && user.id) {
        queryObject.where.userId = user.id
      }
      return queryObject
    }

    async list (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const { page, records } = request.query
        const query = await this.preList(request)
        const items = await this.model.findAndCountAll(query)
        const data = {
          list: items.rows.map((record: Model) => record.toJSON()),
          meta: {
            total: items.count,
            page,
            per_page: records
          }
        }
        return response.response(data)
      } catch (error: any) {
        return Boom.internal(error)
      }
    }

    async preStore (request: Hapi.Request): Promise<Record<string, any>> {
      const { user } = request.auth.credentials as any
      const { createWith } = this.options
      const payload = request.payload
      const data = (createWith) ? (_.pick(payload as Record<string, any>, createWith)) : (payload as Record<string, any>)
      if (user && user.id) {
        data.userId = user.id
      }
      return camelCaseKeys(data) as Record<string, any>
    }

    async store (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const payload = await this.preStore(request)
        const exist = await this.isUnique(request)
        if (exist) {
          return Boom.conflict('Data already exist.')
        }
        const data = await this.model.create(payload)
        return response.response((await data.reload()).toJSON())
      } catch (error: any) {
        return Boom.badData(error)
      }
    }

    public async preShow (request: Hapi.Request): Promise<WhereAttributeHash> {
      return this.buildIdWhereConditions(request)
    }

    async show (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const { included } = this.options
        const { user } = request.auth.credentials as any
        const where = await this.preShow(request)
        const query = {
          where,
          include: included
        }
        if (included !== undefined && included.length === 0) {
          delete query.include
        }
        if (user && user.id) {
          query.where.userId = user.id
        }
        const data = await this.model.findOne(query)
        if (!data) {
          return Boom.notFound('Record not found.')
        }
        return response.response(data.toJSON())
      } catch (error: any) {
        return Boom.badImplementation(error)
      }
    }

    async preUpdate (request: Hapi.Request): Promise<{ where: WhereAttributeHash; data: any; }> {
      const { updateWith } = this.options
      const { payload } = request
      const { user } = request.auth.credentials as any
      const data = (updateWith) ? (_.pick(payload as Record<string, any>, updateWith)) : (payload as Record<string, any>)
      const query = {
        where: this.buildIdWhereConditions(request),
        data: camelCaseKeys(data) as any
      }
      if (user && user.id) {
        query.where.userId = user.id
      }
      return query
    }

    async update (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const { where, data } = await this.preUpdate(request)
        const updateable = await this.model.findOne({ where })
        if (!updateable) {
          return Boom.notFound('No record found.')
        }
        const exist = await this.isUnique(request, updateable.toJSON())
        if (exist) {
          return Boom.conflict('Data already exist.')
        }
        await this.model.update(data, { where })
        const updated = await this.model.findOne({ where })
        if (updated !== null) {
          return response.response(updated.toJSON())
        }
        return Boom.badImplementation('Something went seriously wrong.')
      } catch (error: any) {
        return Boom.badData(error)
      }
    }

    async destroy (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const { user } = request.auth.credentials as any
        const { id } = request.params
        const data = await this.model.findOne({ where: { userId: user.id, id } })
        if (!data) {
          return Boom.notFound('Record not found.')
        }
        data.destroy()
        return response.response(data.toJSON())
      } catch (error: any) {
        return Boom.badImplementation(error)
      }
    }

    async status (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const { id } = request.params
        const { user } = request.auth.credentials as any
        const data: any = await this.model.findOne({ where: { userId: user.id, id } })
        if (!data) {
          return Boom.notFound('Record not found.')
        }
        if (data.status) {
          data.set({ status: 0 })
        } else {
          data.set({ status: 1 })
        }
        const result = await data.save()
        if (!result) {
          return Boom.serverUnavailable('Unknown error.')
        }
        return response.response({
          success: 'Success',
          status: result.status
        })
      } catch (error: any) {
        return Boom.badImplementation(error)
      }
    }

    async preDropdown (request: Hapi.Request): Promise<FindAndCountOptions> {
      const { searchBy } = this.options
      const { sort, order } = request.query
      const { user } = request.auth.credentials as any
      const condition = this.processSearchFilters(_.pick(request.query, searchBy)) as WhereAttributeHash
      if (condition) {
        condition.status = true
      }
      const queryObject = {
        where: condition,
        order: [[camelcase(sort), order.toUpperCase()]] as OrderItem[],
        paranoid: true
      }
      if (user && user.id) {
        queryObject.where.userId = user.id
      }
      return queryObject
    }

    async dropdown (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
      try {
        const query = await this.preDropdown(request)
        const items = await this.model.findAll(query)
        const data = { items: items.map((record: Model) => record.toJSON()) }
        return response.response(data)
      } catch (error: any) {
        return Boom.internal(error)
      }
    }

    protected buildIdWhereConditions (request: Hapi.Request): Record<string, string> {
      const { id } = this.options
      if (typeof id === 'string') {
        return {
          id: request.params[id]
        }
      }
      return Object.entries(id).reduce<Record<string, string>>((where, [paramName, modelKey]) => {
        where[modelKey] = request.params[paramName]
        return where
      }, {})
    }

    protected processSearchFilterField<V = string | Date | number | null> (field: string, value: V): Record<string, any> {
      let filterConditions: V | Record<string, any> | any[] = value
      if (value instanceof Date) {
        return value
      }
      if (typeof value === 'string') {
        try {
          filterConditions = JSON.parse(value)
        } catch (error: any) {
          return value
        }
      } else {
        return filterConditions
      }
      if (typeof filterConditions !== 'object') {
        return value
      }
      if (Array.isArray(filterConditions)) {
        throw new Error(`"${field}" cannot be an array`)
      }
      if (!Object.keys(filterConditions).length) {
        throw new Error(`"${field}" cannot be searched by "{}"`)
      }
      const result: Record<any, any> = {}
      Object.keys(filterConditions).forEach((condition: string) => {
        if (!this.options.permittedFilterOps) {
          return
        }
        const op = this.options.permittedFilterOps[condition]
        if (!op) {
          throw new Error(`"${field}" is being searched by illegal operator "${condition}"`)
        }
        result[op as unknown as string] = (filterConditions as Record<string, any>)[condition]
      })
      return result
    }

    protected processSearchFilters (query: Record<string, any>): Record<string, any> {
      const result: { [key: string]: any; } = {}
      for (const field of Object.keys(query)) {
        try {
          result[field] = this.processSearchFilterField(field, query[field])
        } catch (error: any) {
          const err: Error = error
          const boomErr = Boom.badRequest('Bad search field.')
          _.set(boomErr.output.payload, `errors.${field}`, [err.message])
          throw boomErr
        }
      }
      return camelCaseKeys(result)
    }
}
export default MasterController
