import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: 'courseplatform.noreply@gmail.com',
    pass: 'otwltjbqslvcjkfe', // NOT your Gmail password!
  },
});

  const mailOptions = {
    from: '"courseplatform" <courseplatform.noreply@gmail.com>',
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };

  return transporter.sendMail(mailOptions);
};
