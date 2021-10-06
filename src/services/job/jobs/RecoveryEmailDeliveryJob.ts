import { JobOptions } from 'bull'
import MailSenderService from '../../mail/MailService'
import PasswordRecoveryEnvelope from '../../mail/envelopes/PasswordRecoveryEnvelope'
import PasswordRecovery from '../../../models/PasswordRecovery'
import PasswordRecoveryDoesNotExistError from '../../error/PasswordRecoveryDoesNotExistError'
import Job, { IJobData } from '../JobManager'
import JobProcessor from '../JobProcessor'
import UserEmailMissingError from '../../error/UserNotExistError'

@JobProcessor()
class RecoveryEmailDeliveryJob extends Job {
  public static jobName = 'recoveryEmailDeliveryJob';

  public static async schedule (
    recoveryRecord: PasswordRecovery, status = 'SENT', opts: JobOptions = {}
  ): Promise<{ data: IJobData; opts?: JobOptions; }> {
    return {
      data: {
        recoveryId: recoveryRecord.id,
        status
      },
      opts
    }
  }

  public async process (data: { recoveryId: number; status: string; }): Promise<void> {
    const { recoveryId: recoveryRecordId, status } = data
    const recoveryRecord = await PasswordRecovery.findByPk(recoveryRecordId)
    if (!recoveryRecord) {
      throw new PasswordRecoveryDoesNotExistError()
    }
    await this.sendRecoveryEmail(recoveryRecord, status)
  }

  public async sendRecoveryEmail (recoveryRecord: PasswordRecovery, status = 'SENT'): Promise<void> {
    const user = await recoveryRecord.getUser()
    if (!user.email) {
      throw new UserEmailMissingError('User does not have email address assigned')
    }

    await MailSenderService.sendToEmail(
      user.email,
      new PasswordRecoveryEnvelope(recoveryRecord.recoveryToken, recoveryRecord.verificationCode)
    )

    await recoveryRecord.update({
      sentAt: new Date(),
      status
    })
  }
}

export default RecoveryEmailDeliveryJob
