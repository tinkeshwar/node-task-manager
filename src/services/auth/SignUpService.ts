import moment from 'moment'
import sequelize from '../../config/database'
import { User } from '../../models'
import AccountVerification from '../../models/AccountVerification'
import { AccountVerificationDoesNotExistError, UserAlreadyExistError, UserNotExistError } from '../error'
import { Dispatchable, EventManager } from '../event'
import { IEventDispatcher } from '../event/ListenManager'
import AccountVerificationEmailDeliveryJob from '../job/jobs/AccountVerificationEmailDeliveryJob'

const VERIFICATION_EXPIRES_IN_MINUTES = 30

@Dispatchable
class SignUpService {
  public static async register (name: string, email: string, password: string, phone: number): Promise<User> {
    const result = await sequelize.transaction(async (t) => {
      const existEmail = await User.findOne({ where: { email }, transaction: t })
      if (existEmail) {
        throw new UserAlreadyExistError('User email already exist')
      }

      const exist = await User.findOne({ where: { phone }, transaction: t })
      if (exist) {
        throw new UserAlreadyExistError('User phone already exist')
      }

      const user = await User.create({ firstname: name, email, password, phone }, { transaction: t })

      const verificationRecord = await AccountVerification.create({
        userId: user.id,
        verificationMethod: 'email',
        expiresAt: moment().add(VERIFICATION_EXPIRES_IN_MINUTES, 'minutes').toDate()
      }, { transaction: t })

      return { verificationRecord, user }
    })

    await EventManager.emit('PASSWORD_RECOVERY_INIT_EMAIL', {
      userId: result.verificationRecord.userId
    })

    return result.user
  }

  public static async sendVerification (email: string) {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: { email }, transaction: t })
      if (!user) {
        throw new UserNotExistError('Account not exist')
      }
      if (user.emailVerifiedAt) {
        throw new Error('User already verified.')
      }
      const verificationRecord = await AccountVerification.findOne({ where: { userId: user.id } })
      if (verificationRecord) {
        verificationRecord.destroy()
      }
      const verificationRecordNew = await AccountVerification.create({
        userId: user.id,
        verificationMethod: 'email',
        expiresAt: moment().add(VERIFICATION_EXPIRES_IN_MINUTES, 'minutes').toDate()
      }, { transaction: t })
      return { verificationRecordNew, user }
    })

    await EventManager.emit('PASSWORD_RECOVERY_INIT_EMAIL', {
      userId: result.verificationRecordNew.userId
    })
    return result.user
  }

  public static async show (verificationToken: string, verificationCode: string): Promise<AccountVerification | null> {
    return AccountVerification.findOne({ where: { verificationToken, verificationCode } })
  }

  public static async verify (
    verificationToken: string,
    verificationCode: string
  ): Promise<User> {
    const result = await sequelize.transaction(async (t) => {
      const verificationRecord = await AccountVerification.findOne({ where: { verificationToken }, transaction: t })
      if (!verificationRecord) {
        throw new AccountVerificationDoesNotExistError('User does not exist')
      }
      await this.checkRecordExpiration(verificationRecord)
      if (verificationCode !== verificationRecord.verificationCode) {
        throw new AccountVerificationDoesNotExistError('Invalid account verification code.')
      }

      const user = await verificationRecord.getUser({ transaction: t })
      await user.update({ emailVerifiedAt: new Date(), status: true }, { transaction: t })
      await verificationRecord.destroy({ transaction: t })
      return user
    })

    return result
  }

  public static subscribe (dispatcher: IEventDispatcher): void {
    dispatcher.on('ACCOUNT_VERIFICATION_EXPIRED', async (data: {
      verificationToken: string;
    }) => {
      const { verificationToken } = data
      const verificationRecord = await AccountVerification.findOne({ where: { verificationToken } })
      if (!verificationRecord) {
        throw new AccountVerificationDoesNotExistError()
      }
      await verificationRecord.destroy()
    })

    dispatcher.on('PASSWORD_RECOVERY_INIT_EMAIL', async (data: {
      userId: number;
    }) => {
      const { userId } = data
      const verificationRecord = await AccountVerification.findOne({ where: { userId } })
      if (!verificationRecord) {
        throw new AccountVerificationDoesNotExistError()
      }
      if (verificationRecord.verificationMethod === 'email') {
        await AccountVerificationEmailDeliveryJob.schedule(verificationRecord)
      }
    })
  }

  public static async checkRecordExpiration (verificationRecord: AccountVerification): Promise<void> {
    if (verificationRecord.isExpired) {
      await EventManager.emit('ACCOUNT_VERIFICATION_EXPIRED', {
        verification_token: verificationRecord.verificationToken
      })
      throw new AccountVerificationDoesNotExistError('Password recovery is expired')
    }
  }
}

export default SignUpService
