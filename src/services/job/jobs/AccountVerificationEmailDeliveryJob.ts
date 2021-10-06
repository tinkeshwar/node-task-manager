import { JobOptions } from 'bull'
import MailSenderService from '../../mail/MailService'
import Job, { IJobData } from '../JobManager'
import JobProcessor from '../JobProcessor'
import UserEmailMissingError from '../../error/UserNotExistError'
import AccountVerification from '../../../models/AccountVerification'
import { AccountVerificationDoesNotExistError } from '../../error'
import VerificationEnvelope from '../../mail/envelopes/VerificationEnvelope'

@JobProcessor()
class AccountVerificationEmailDeliveryJob extends Job {
  public static jobName = 'accountVerificationEmailDeliveryJob';

  public static async schedule (
    verificationRecord: AccountVerification, status = 'SENT', opts: JobOptions = {}
  ): Promise<{ data: IJobData; opts?: JobOptions; }> {
    return {
      data: {
        verificationId: verificationRecord.id,
        status
      },
      opts
    }
  }

  public async process (data: { verificationId: number; status: string; }): Promise<void> {
    const { verificationId: verificationRecordId, status } = data
    const verificationRecord = await AccountVerification.findByPk(verificationRecordId)
    if (!verificationRecord) {
      throw new AccountVerificationDoesNotExistError()
    }
    await this.sendVerificationEmail(verificationRecord, status)
  }

  public async sendVerificationEmail (verificationRecord: AccountVerification, status = 'SENT'): Promise<void> {
    const user = await verificationRecord.getUser()
    if (!user.email) {
      throw new UserEmailMissingError('User does not have email address assigned')
    }

    await MailSenderService.sendToEmail(
      user.email,
      new VerificationEnvelope(verificationRecord.verificationToken, verificationRecord.verificationCode)
    )

    await verificationRecord.update({
      sentAt: new Date(),
      status
    })
  }
}

export default AccountVerificationEmailDeliveryJob
