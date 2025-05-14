import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Kuber Karki" <karkikuber5@gmail.com>',
    to: 'kuberdai789@gmail.com',
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };

  return transporter.sendMail(mailOptions);
};
