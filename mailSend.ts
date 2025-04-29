import nodemailer from 'nodemailer';
export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'karkikuber5@gmail.com',
      pass: 'rapfolutddihrwym',
    },
  });

  const mailOptions = {
    from: 'Kuber Karki" <karkikuber5@gmail.com>',
    to: 'karkikuber5@gmail.com',
    subject: 'Test Email from Node.js',
    text: 'Hello from Node.js!',
    html: '<b>Hello from Node.js!</b>',
  };

  return transporter.sendMail(mailOptions);
};

