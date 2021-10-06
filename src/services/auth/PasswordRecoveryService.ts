import moment from 'moment'
import sequelize from '../../config/database'
import { PasswordRecovery, User } from '../../models'
import InvalidPasswordRecoveryVerificationCodeError from '../error/InvalidPasswordRecoveryVerificationCodeError'
import PasswordRecoveryDoesNotExistError from '../error/PasswordRecoveryDoesNotExistError'
import PasswordRecoveryExpiredError from '../error/PasswordRecoveryExpiredError'
import UserDoesNotExistError from '../error/UserNotExistError'
import { Dispatchable, EventManager } from '../event'
import { IEventDispatcher } from '../event/ListenManager'
import RecoveryEmailDeliveryJob from '../job/jobs/RecoveryEmailDeliveryJob'

const RECOVERY_EXPIRES_IN_MINUTES = 30

type UserLogin =
{
  email: string;
  phoneNumber?: never;
} |
{
  email?: never;
  phoneNumber: string;
};

@Dispatchable
class PasswordRecoveryService {
  public static async requestRecovery (login: UserLogin): Promise<PasswordRecovery> {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: login as any, transaction: t })
      if (!user) {
        throw new UserDoesNotExistError('User does not exist')
      }

      let recoveryMethod: 'email' | 'sms' | undefined
      if (login.email) {
        recoveryMethod = 'email'
      } else if (login.phoneNumber) {
        recoveryMethod = 'sms'
      }

      if (!recoveryMethod) {
        throw new Error('Could not define password recovery method')
      }
      let recoveryRecord = await PasswordRecovery.findOne({
        where: { userId: user.id },
        transaction: t
      })
      let invalidatedRecoveryToken: string | undefined
      if (recoveryRecord) {
        invalidatedRecoveryToken = recoveryRecord.recoveryToken
        await recoveryRecord.destroy({ transaction: t })
      }
      recoveryRecord = await PasswordRecovery.create({
        userId: user.id,
        recoveryMethod,
        expiresAt: moment().add(RECOVERY_EXPIRES_IN_MINUTES, 'minutes').toDate()
      }, { transaction: t })

      return { recoveryRecord, invalidatedRecoveryToken }
    })

    if (result.recoveryRecord.recoveryMethod === 'email') {
      await RecoveryEmailDeliveryJob.schedule(result.recoveryRecord)
    }

    if (result.invalidatedRecoveryToken) {
      await EventManager.emit('PASSWORD_RECOVERY_INVALIDATED', {
        recovery_token: result.invalidatedRecoveryToken
      })
    }

    await EventManager.emit('PASSWORD_RECOVERY_INIT', {
      recovery_token: result.recoveryRecord.recoveryToken,
      recovery_method: result.recoveryRecord.recoveryMethod,
      user_id: result.recoveryRecord.userId
    })

    return result.recoveryRecord
  }

  public static async show (recoveryToken: string, verificationCode: string): Promise<PasswordRecovery | null> {
    return PasswordRecovery.findOne({ where: { recoveryToken, verificationCode } })
  }

  public static async recover (
    recoveryToken: string,
    verificationCode: string,
    newPassword: string
  ): Promise<PasswordRecovery> {
    const result = await sequelize.transaction(async (t) => {
      const recoveryRecord = await PasswordRecovery.findOne({ where: { recoveryToken }, transaction: t })
      if (!recoveryRecord) {
        throw new PasswordRecoveryDoesNotExistError('Password recovery record does not exist')
      }

      await this.checkRecoveryRecordExpiration(recoveryRecord)
      if (verificationCode !== recoveryRecord.verificationCode) {
        throw new InvalidPasswordRecoveryVerificationCodeError('Invalid password recovery verification code')
      }

      const user = await recoveryRecord.getUser({ transaction: t })
      await user.update({ password: newPassword }, { transaction: t })
      await recoveryRecord.destroy({ transaction: t })
      return recoveryRecord
    })

    await EventManager.emit('PASSWORD_RECOVERY_OK', {
      recovery_token: result.recoveryToken
    })

    return result
  }

  public static subscribe (dispatcher: IEventDispatcher): void {
    dispatcher.on('PASSWORD_RECOVERY_EXPIRED', async (data: {
      recoveryToken: string;
    }) => {
      const { recoveryToken } = data
      const recoveryRecord = await PasswordRecovery.findOne({ where: { recoveryToken } })
      if (!recoveryRecord) {
        throw new PasswordRecoveryDoesNotExistError()
      }
      await recoveryRecord.destroy()
    })
  }

  public static async checkRecoveryRecordExpiration (recoveryRecord: PasswordRecovery): Promise<void> {
    if (recoveryRecord.isExpired) {
      await EventManager.emit('PASSWORD_RECOVERY_EXPIRED', {
        recovery_token: recoveryRecord.recoveryToken
      })
      throw new PasswordRecoveryExpiredError('Password recovery is expired')
    }
  }
}

export default PasswordRecoveryService
