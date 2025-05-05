"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("../utils/email/service");
const httpException_1 = __importDefault(require("../utils/api/httpException"));
const emailRouter = (0, express_1.Router)();
emailRouter.post('/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;
    try {
        const info = await (0, service_1.sendEmail)({ to, subject, text, html });
        res.status(200).json({
            message: 'Email sent successfully!',
            messageId: info.messageId,
        });
    }
    catch (error) {
        throw new httpException_1.default(500, 'Failed to send email');
    }
});
exports.default = emailRouter;
