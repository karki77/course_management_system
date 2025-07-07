import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  console.log('Sending email to:');
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false, // true for 465, false for other ports

      auth: {
        user: '631dea782056d1', // generated ethereal user
        pass: '529ee0c4d01ac0', // NOT your Gmail password! //use app password instead
      },
    });

    const mailOptions = {
      from: 'expensetracker1029@gmail.com',
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    const data = await transporter.sendMail(mailOptions);

    console.log('Email sent:', data.response);
    return data;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
