"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bodyValidator_1 = __importDefault(require("../utils/validators/bodyValidator"));
const validation_1 = require("../modules/user/validation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rolemiddleware_1 = require("../middleware/rolemiddleware");
const multer_1 = __importDefault(require("../utils/multer"));
const validation_2 = require("../modules/user/validation");
const enrollmentValidation_1 = require("../modules/enrollment/enrollmentValidation");
const enrollmentController_1 = require("../modules/enrollment/enrollmentController");
const mediaRequest_1 = require("../utils/validators/mediaRequest");
const controller_1 = require("../modules/user/controller");
/**
 * User Router
 */
const userRouter = (0, express_1.Router)();
userRouter.post('/login', (0, bodyValidator_1.default)(validation_1.loginUserSchema), controller_1.loginUser);
userRouter.post('/register', (0, bodyValidator_1.default)(validation_1.registerUserSchema), controller_1.registerUser);
userRouter.patch('/change-password', authMiddleware_1.authMiddleware, (0, bodyValidator_1.default)(validation_1.changePasswordSchema), controller_1.changePasssword);
userRouter.get('/role', authMiddleware_1.authMiddleware, (0, rolemiddleware_1.roleMiddleware)([client_1.UserRole.STUDENT]), async (req, res) => {
    res.json({ message: 'Hello from student router' });
});
userRouter.get('/instructor', authMiddleware_1.authMiddleware, (0, rolemiddleware_1.roleMiddleware)([client_1.UserRole.INSTRUCTOR]), async (req, res) => {
    res.json({ message: 'Hello from instructor router' });
});
userRouter.patch('/update-profile', authMiddleware_1.authMiddleware, multer_1.default.single('file'), mediaRequest_1.mediaRequest, (0, bodyValidator_1.default)(validation_2.updateProfileSchema), controller_1.updateProfile);
userRouter.get('/profile', authMiddleware_1.authMiddleware, controller_1.getUserWithProfile);
userRouter.post('/enroll', authMiddleware_1.authMiddleware, (0, rolemiddleware_1.roleMiddleware)([client_1.UserRole.STUDENT]), (0, bodyValidator_1.default)(enrollmentValidation_1.createEnrollmentSchema), enrollmentController_1.enroll);
exports.default = userRouter;
