import mailgunFactory from 'mailgun-js'
import qs from 'querystring'
import logger from '../../config/logger'
import IEnvelope from './envelopes/IEnvelope'

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  NODE_ENV
} = process.env

const mailgun = mailgunFactory({
  apiKey: MAILGUN_API_KEY as string || 'na',
  domain: MAILGUN_DOMAIN as string || 'na',
  testMode: (NODE_ENV === 'development'),
  testModeLogger: (options, payload) => {
    logger.info(JSON.stringify(qs.parse(payload), null, 2))
    logger.info(options)
  }
})

class MailService {
  public static async sendToEmail (email: string, envelope: IEnvelope): Promise<void> {
    const data = {
      from: MAILGUN_FROM || 'na',
      to: email,
      subject: envelope.subject,
      text: envelope.text,
      inline: envelope.attachment,
      html: envelope.html
    }

    await new Promise<void>((resolve, reject) => {
      mailgun.messages().send(data, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }
}

export default MailService
