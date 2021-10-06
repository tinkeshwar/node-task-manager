import sequelize from '../src/config/database'
import * as server from '../src/config/server'
import EventBus from '../src/services/event/EventManager'
import MetricsCollectionService from '../src/services/metrics/MetricsCollectionService'
import QueueManager from '../src/services/queue/QueueManager'
import RedisCacheManager from '../src/services/cache/Redis'
import { access } from './utils/helper'
import logger from '../src/config/logger'

global.Promise = require('bluebird');

(Promise as any).config({
  cancellation: true
})

require('dotenv').config()

const {
  REDIS_TEST_URL,
  REDIS_URL
} = process.env as Record<string, string>

function handleDiagnostics () {
  setTimeout(() => {
    const arr: any[] = []
    logger.info(arr)
  }, 3000)
}

export async function mochaGlobalSetup () {
  await sequelize.authenticate()
  QueueManager.init(REDIS_TEST_URL || REDIS_URL, 'admin_test_bull')
  EventBus.init()
  const metricsNamespace = 'admin_test'
  await MetricsCollectionService.init(metricsNamespace)
  await server.init()
  const auth = await access();
  (global as any).adminToken = auth.token;
  (global as any).refreshToken = auth.refresh;
  (global as any).superadmin = {
    email: 'tinkeshwar@admin.com',
    password: 'admin'
  }
}

export async function mochaShutdown () {
  await server.stop()
  await QueueManager.close()
  await sequelize.close()
  await RedisCacheManager.close()
  await MetricsCollectionService.close()
  handleDiagnostics()
}
