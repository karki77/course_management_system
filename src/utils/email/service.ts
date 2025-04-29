import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'karkikuber5@gmail.com',
      pass: 'uckrdresqtevefss',
    },
  });

  const mailOptions = {
    from: '"Kuber Karki" <karkikuber5@gmail.com>',
    to: "karkikuber5@gmail.com",
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };
  

  return transporter.sendMail(mailOptions);
};

