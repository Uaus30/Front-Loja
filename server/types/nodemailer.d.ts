declare module "nodemailer" {
  interface MailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
  }

  interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<unknown>;
  }

  interface CreateTransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
    tls?: {
      ciphers?: string;
    };
  }

  function createTransport(options: CreateTransportOptions): Transporter;

  export default {
    createTransport,
  };
}
