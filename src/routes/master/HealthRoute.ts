import HealthController from '../../controllers/master/HealthController'

const controller = new HealthController()

export default [
  {
    path: '/',
    method: 'GET',
    handler: controller.check.bind(controller)
  },
  {
    path: '/api/server-state',
    method: 'GET',
    handler: controller.cpu.bind(controller),
    options: {
      auth: {
        strategy: 'token'
      },
      validate: {
        options: { abortEarly: false }
      }
    }
  }
]
