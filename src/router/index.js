"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseRouter_1 = __importDefault(require("./courseRouter"));
const emailRouter_1 = __importDefault(require("./emailRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const router = (0, express_1.Router)();
router.use('/email', emailRouter_1.default);
router.use('/user', userRouter_1.default);
router.use('/course', courseRouter_1.default);
exports.default = router;
