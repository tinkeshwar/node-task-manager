import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import { User } from '../../models'
import ProfileService from '../../services/auth/ProfileService'
import { EventManager } from '../../services/event'
import { FileManager } from '../../services/file'

class ProfileController {
  async profile (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const user = await ProfileService.profile(request)
      return response.response(user)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async changePassword (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const user = await ProfileService.changePassword(request)
      return response.response(user)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async changeProfile (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { id } = request.auth.credentials.user as any
      const { firstname, middlename, lastname, phone } = request.payload as any
      const { image }: {image?:{file: string, ext: string}} = request.payload as any
      const user = await User.findByPk(id)
      if (!user) {
        return Boom.notFound('Account not exist.')
      }
      await user.update({ firstname, middlename, lastname, phone })
      if (image && user) {
        let existingImage = null
        let imageId = null
        const upload = await FileManager.saveFile(image.file, image.ext, 'image')
        const imageExist = await user.getImage()
        if (imageExist) {
          existingImage = imageExist.path
          imageId = imageExist.id
          await imageExist.update({ name: upload.filename, path: upload.filepath, publicUrl: upload.publicUrl })
        } else {
          const imageResponse = await user.createImage({ name: upload.filename, path: upload.filepath, publicUrl: upload.publicUrl, imageableId: user.id, imageableType: 'user' })
          imageId = imageResponse.id
        }
        if (imageId) {
          EventManager.emit('IMAGE_UPLOADED', {
            imageId,
            existingImage
          })
        }
      }
      return response.response(user.toJSON())
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }
}
export default ProfileController
