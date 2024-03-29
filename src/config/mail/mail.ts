interface IMailConfig {
  driver: 'ethereal'
  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'contato@apivendas.com.br',
      name: 'Suporte'
    }
  }
} as IMailConfig
