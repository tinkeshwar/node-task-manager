import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import Task from '../../models/Task'
import MasterController from '../master/MasterController'
import { Bucket } from '../../models'

class TaskController extends MasterController<typeof Task> {
  constructor () {
    super(Task)
  }

  async store (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const payload = await this.preStore(request) as any
      if (payload.bucketId) {
        const bucket = await Bucket.findOne({ where: { id: payload.bucketId, userId: payload.userId } })
        if (!bucket) {
          return Boom.notFound('Bucket not found.')
        }
      }
      payload.history = [JSON.stringify({ status: 'created', updatedAt: new Date() })]
      const task = await Task.create(payload)
      return response.response((await task.reload()).toJSON())
    } catch (error: any) {
      return Boom.badData(error)
    }
  }

  async update (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { where, data } = await this.preUpdate(request)
      const updateable = await Task.findOne({ where })
      if (!updateable) {
        return Boom.notFound('No record found.')
      }
      await updateable.update(data)
      await updateable.updateStatus('updated')
      const updated = await Task.findOne({ where })
      if (updated !== null) {
        return response.response(updated.toJSON())
      }
      return Boom.badImplementation('Something went wrong.')
    } catch (error: any) {
      return Boom.badData(error)
    }
  }

  async status (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { id } = request.params
      const { user } = request.auth.credentials as any
      const data: any = await Task.findOne({ where: { userId: user.id, id } })
      if (!data) {
        return Boom.notFound('Record not found.')
      }
      if (data.isComplete) {
        data.set({ isComplete: 0 })
      } else {
        data.set({ isComplete: 1 })
      }
      const result = await data.save()
      await result.updateStatus(result.isComplete ? 'complete' : 'incomplete')
      if (!result) {
        return Boom.serverUnavailable('Unknown error.')
      }
      return response.response({
        success: 'Success',
        status: result.isComplete ? 'complete' : 'incomplete'
      })
    } catch (error: any) {
      return Boom.badImplementation(error)
    }
  }
}

TaskController.options = {
  id: 'id',
  searchBy: ['id'],
  sortBy: ['created_at', 'desc'],
  createWith: ['name', 'description', 'priority', 'deadline_at', 'bucket_id'],
  updateWith: ['name', 'description', 'priority', 'deadline_at', 'bucket_id', 'status'],
  included: ['bucket']
}

export default TaskController
