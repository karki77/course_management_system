import nodemailer from 'nodemailer';
import { IEmailSend } from './types';

export const sendEmail = async (payload: IEmailSend) => {
  console.log('Sending email to:');
  try{
    const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: 'courseplatform.noreply@gmail.com',
    pass: 'otwltjbqslvcjkfe', // NOT your Gmail password!
  },
});

  const mailOptions = {
    from: 'courseplatform.noreply@gmail.com',
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  };

  const data=await transporter.sendMail(mailOptions);

  console.log('Email sent:', data.response);
  return data
  }catch(err){
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
