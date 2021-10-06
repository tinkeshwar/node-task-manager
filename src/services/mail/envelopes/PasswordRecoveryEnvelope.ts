import path from 'path'
import pug from 'pug'
import IEnvelope from './IEnvelope'

const {
  FRONTEND_PASSWORD_RECOVERY_URL
} = process.env

class PasswordRecoveryEnvelope implements IEnvelope {
  public subject: string;
  public text?: string;
  public html?: string;
  public attachment?: any;

  public constructor (recoveryToken: string, verificationCode: string) {
    this.subject = 'Password recovery'
    const link = (FRONTEND_PASSWORD_RECOVERY_URL as string).replace('@@token', recoveryToken).replace('@@code', verificationCode)
    this.html = pug.renderFile(path.join(__dirname, 'PasswordRecoveryEnvelope.pug'), { link })
  }
}

export default PasswordRecoveryEnvelope
