"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2_1.default.hash(password);
        return hashedPassword;
    }
    catch (error) {
        throw new Error('Error hashing password');
    }
};
exports.hashPassword = hashPassword;
const verifyPassword = async (hashPassword, password) => {
    try {
        const isPasswordValid = await argon2_1.default.verify(hashPassword, password);
        return isPasswordValid;
    }
    catch (error) {
        throw new Error('Error verifying password');
    }
};
exports.verifyPassword = verifyPassword;
