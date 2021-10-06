import path from 'path'
import pug from 'pug'

import IEnvelope from './IEnvelope'

const {
  FRONTEND_EMAIL_VERIFICATION_URL
} = process.env

class VerificationEnvelope implements IEnvelope {
  public subject: string;
  public text?: string;
  public html?: string;
  public attachment?: any;

  public constructor (token: string, code: string) {
    this.subject = 'Please verify your email address'
    const link = (FRONTEND_EMAIL_VERIFICATION_URL as string).replace('@@token', token).replace('@@code', code)
    this.html = pug.renderFile(path.join(__dirname, 'VerificationEnvelope.pug'), { link })
  }
}

export default VerificationEnvelope
