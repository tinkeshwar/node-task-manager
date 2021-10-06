import { JobOptions } from 'bull'
import MailSenderService from '../../mail/MailService'
import Job, { IJobData } from '../JobManager'
import JobProcessor from '../JobProcessor'
import User from '../../../models/User'
import { UserEmailMissingError, UserNotExistError } from '../../error'
import PasswordChangeEnvelope from '../../mail/envelopes/PasswordChangeEnvelope'

@JobProcessor()
class PasswordChangeEmailDeliveryJob extends Job {
  public static jobName = 'passwordChangeEmailDeliveryJob';

  public static async schedule (
    user: User, status = 'SENT', opts: JobOptions = {}
  ): Promise<{ data: IJobData; opts?: JobOptions; }> {
    return {
      data: {
        userId: user.id,
        status
      },
      opts
    }
  }

  public async process (data: { userId: number }): Promise<void> {
    const { userId } = data
    const userRecord = await User.findByPk(userId)
    if (!userRecord) {
      throw new UserNotExistError()
    }
    await this.sendPasswordChangeEmail(userRecord)
  }

  public async sendPasswordChangeEmail (user: User): Promise<void> {
    if (!user.email) {
      throw new UserEmailMissingError('User does not have email address assigned')
    }

    await MailSenderService.sendToEmail(
      user.email,
      new PasswordChangeEnvelope(user.firstname || 'User')
    )
  }
}

export default PasswordChangeEmailDeliveryJob
