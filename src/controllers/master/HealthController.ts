import * as Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import CPUService from '../../services/performance/CPUService'
import pidusage from 'pidusage'

class HealthController {
  async check (_request: Hapi.Request, response: Hapi.ResponseToolkit) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    }
    return response.response(healthcheck)
  }

  async cpu (_request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const healthcheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        cpu: await CPUService.cpuAverage(),
        usage: await pidusage(process.pid)
      }
      return response.response(healthcheck)
    } catch (error: any) {
      return Boom.internal(error || 'Something not right here.')
    }
  }
}
export default HealthController
