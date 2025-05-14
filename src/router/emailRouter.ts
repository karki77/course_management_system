import { Router, Request, Response } from 'express';
import { sendEmail } from '../utils/email/service';
import HttpException from '../utils/api/httpException';

const emailRouter = Router();

/**
 * @swagger
 * /api/v1/email/send-email:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               subject:
 *                 type: string
 *                 example: Welcome to our platform
 *               text:
 *                 type: string
 *                 example: Thank you for joining our platform.
 *               html:
 *                 type: string
 *                 example: <h1>Thank you for joining our platform.</h1>
 *             required:
 *               - to
 *               - subject
 *               - text
 *               - html
 *     responses:
 *       200:
 *         description: Email sent successfully
 *     apiResponse:
 *        message: {message: "Email sent successfully!"}
 */

emailRouter.post('/send-email', async (req: Request, res: Response) => {
  const { to, subject, text, html } = req.body;
  try {
    const info = await sendEmail({ to, subject, text, html });
    res.status(200).json({
      message: 'Email sent successfully!',
      messageId: info.messageId,
    });
  } catch (error) {
    throw new HttpException(500, 'Failed to send email');
  }
});

export default emailRouter;

// role -> specific data.
// INSTRUCTOR, STUDENT, ADMIN

// update userProfile -> email(required), bio(optional), image(optional):

// 200. success message
// api response: {data: {username: "", email: "", bio: "", image: ""}}

// api response type: {data: {username: string, email: string, bio: string, image: string}}
