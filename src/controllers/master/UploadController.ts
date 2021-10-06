import * as Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import UploadService from '../../services/upload/UploadService'

class UploadController {
  async image (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const options = {
        type: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
        size: 5242880
      }
      const file = await UploadService.upload(request, options)
      return response.response(file)
    } catch (error: any) {
      return Boom.gatewayTimeout(error)
    }
  }

  async file (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const options = {
        type: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
        size: 5242880
      }
      const file = await UploadService.upload(request, options)
      return response.response(file)
    } catch (error: any) {
      return Boom.gatewayTimeout(error)
    }
  }
}

export default UploadController
