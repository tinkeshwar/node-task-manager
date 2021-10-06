import Boom from '@hapi/boom'
import { Permission, Role } from '../../src/models'
import User from '../../src/models/User'
import AuthService from '../../src/services/auth/AuthService'

export const access = async (): Promise<{token: string, refresh: string}> => {
  const permissions = await Permission.findAll()
  const role = await Role.findByPk(1)
  const user = await User.findByPk(1)
  if (!user) {
    throw Boom.notFound('User not found')
  }
  if (!role) {
    throw Boom.notFound('Role not found')
  }
  if (user !== null && role !== null && user.hasRole(role)) {
    await Promise.all(permissions.map(async permission => {
      await role.addPermission(permission)
    }))
    await user.addRole(role)
  }
  const authData = await AuthService.authorize(user)
  return { token: authData.token, refresh: authData.refresh }
}
