import {Router, Request, Response} from 'express';
import { sendEmail } from '../../mailSend';
import HttpException from '../utils/api/httpException';

const emailRouter = Router();

emailRouter.post('/send-email', async (req: Request, res: Response) => {
    const {to, subject, text, html} = req.body;
    try{
        const info = await sendEmail(to, subject, text, html);
        res.status(200).json({
          message: 'Email sent successfully!',
          messageId: info.messageId,
        });
    }catch(error){
      throw new HttpException(500, "Failed to send email")
    }
})
export default emailRouter;