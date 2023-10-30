import nodemailer from 'nodemailer';

export class UtilsSendMail {
  public static async send(email: string, secret: number) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIl_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIl_USER,
        pass: process.env.MAIl_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIl_HOST,
      to: email,
      subjet: 'Resete sua senha',
      text: `Código de segurança: ${secret}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
