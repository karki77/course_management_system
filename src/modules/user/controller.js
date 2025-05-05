"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithProfile = exports.updateProfile = exports.changePasssword = exports.loginUser = exports.registerUser = void 0;
const httpResponse_1 = require("../../utils/api/httpResponse");
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
const service_1 = __importDefault(require("./service"));
/**
 * Register User
 */
const registerUser = async (req, res, next) => {
    try {
        const data = await service_1.default.register(req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: 'User registered successfully',
            data,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
/**
 * Login User
 */
const loginUser = async (req, res, next) => {
    try {
        const data = await service_1.default.login(req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: 'User login successfully',
            data,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
/**
 * Change User Password
 */
const changePasssword = async (req, res, next) => {
    try {
        if (!req?.user?.id) {
            throw new httpException_1.default(401, 'User not authenticated');
        }
        await service_1.default.changePassword(req.user.id, req.body);
        res.send(new httpResponse_1.HttpResponse({
            message: 'Password changed successfully',
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.changePasssword = changePasssword;
const updateProfile = async (req, res, next) => {
    try {
        if (!req?.user?.id) {
            throw new httpException_1.default(401, 'User not authenticated');
        }
        const image = req.file?.filename;
        const bio = req.body.bio;
        const updatedprofile = await service_1.default.updateProfile(req.user.id, {
            bio,
            image,
        });
        res.send(new httpResponse_1.HttpResponse({
            message: 'Profile updated successfully',
            data: updatedprofile,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const getUserWithProfile = async (req, res, next) => {
    try {
        if (!req?.user?.id) {
            throw new httpException_1.default(404, 'User not found');
        }
        const user = await service_1.default.getUserWithProfile(req.user.id);
        res.send(new httpResponse_1.HttpResponse({
            message: 'user with profile fetched successfully',
            data: user,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.getUserWithProfile = getUserWithProfile;
