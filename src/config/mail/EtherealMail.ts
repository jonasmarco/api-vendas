import nodemailer from 'nodemailer'
import HandlebarsMailTemplate, {
  IParseMailTemplate
} from './HandlebarsMailTemplate'

interface IMailContact {
  name: string
  email: string
}

interface ISendMail {
  to: IMailContact
  from?: IMailContact
  subject: string
  templateData: IParseMailTemplate
}

export default class EtherealMail {
  static async sendMail({
    to,
    from,
    subject,
    templateData
  }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount()

    const mailTemplate = new HandlebarsMailTemplate()

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    })

    transporter
      .sendMail({
        from: {
          name: from?.name || 'Equipe API',
          address: from?.email || 'equipe@apivendas.com'
        },
        to: {
          name: to.name,
          address: to.email
        },
        subject,
        html: await mailTemplate.parse(templateData)
      })
      .then(message => {
        console.log('Message sent: ' + message.messageId)
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(message))
      })
  }
}
