import nodemailer from 'nodemailer';

export class UtilsSendMail {
  public static async send(email: string, secret: number) {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '781d4a859fd3f8',
        pass: '2a7ad02ec4b018',
      },
    });

    const mailOptions = {
      from: 'sandbox.smtp.mailtrap.io',
      to: email,
      subjet: 'Resete sua senha',
      text: `Código se segurança: ${secret}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
