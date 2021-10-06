import path from 'path'
import pug from 'pug'
import IEnvelope from './IEnvelope'

class PasswordChangeEnvelope implements IEnvelope {
  public subject: string;
  public text?: string;
  public html?: string;
  public attachment?: any;

  public constructor (name: string) {
    this.subject = 'Password Change Alert'
    this.html = pug.renderFile(path.join(__dirname, 'PasswordChangeEnvelope.pug'), { name })
  }
}

export default PasswordChangeEnvelope
