"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (payload) => {
    const transporter = nodemailer_1.default.createTransport({
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
        to: 'kuberdai789@gmail.com',
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
    };
    return transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
