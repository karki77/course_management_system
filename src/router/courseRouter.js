"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodyValidator_1 = __importDefault(require("../utils/validators/bodyValidator"));
const courseController_1 = require("../modules/course/courseController");
const courseValidation_1 = require("../modules/course/courseValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rolemiddleware_1 = require("../middleware/rolemiddleware");
const client_1 = require("@prisma/client");
const courseRouter = (0, express_1.Router)();
courseRouter.post('/create', authMiddleware_1.authMiddleware, (0, rolemiddleware_1.roleMiddleware)([client_1.UserRole.INSTRUCTOR]), (0, bodyValidator_1.default)(courseValidation_1.createCourseSchema), courseController_1.createCourse);
courseRouter.patch('/update', authMiddleware_1.authMiddleware, (0, rolemiddleware_1.roleMiddleware)([client_1.UserRole.INSTRUCTOR]), (0, bodyValidator_1.default)(courseValidation_1.updateCourseSchema), courseController_1.updateCourse);
exports.default = courseRouter;
