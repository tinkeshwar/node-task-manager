import { flatten } from 'lodash'
import Health from './master/HealthRoute'
import Auth from './auth/AuthRoute'
import Upload from './master/UploadRoute'
import AuthUser from './auth/AuthUserRoute'
import Bucket from './task/BucketRoute'
import Task from './task/TaskRoute'

export default flatten([
  Task as any,
  Bucket as any,
  AuthUser as any,
  Upload as any,
  Health as any,
  Auth as any
])
