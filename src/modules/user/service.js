"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const httpException_1 = __importDefault(require("../../utils/api/httpException"));
const service_1 = require("../../utils/email/service");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const hash_1 = require("../../utils/password/hash");
class UserService {
    async register(data) {
        const existingUser = await config_1.prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });
        if (existingUser) {
            throw new httpException_1.default(400, 'Email or username already exist');
        }
        const hashedPassword = await (0, hash_1.hashPassword)(data.password);
        const user = await config_1.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: data.role,
                profile: {
                    create: {
                        bio: 'hello there',
                        image: ' ',
                    },
                },
            },
        });
        // transaction
        let emailResult;
        try {
            emailResult = await (0, service_1.sendEmail)({
                to: user.email,
                subject: 'Welcome to our courses platform',
                text: `Hello ${user.username}, welcome to our platform!`,
                html: `<h1>Welcome ${user.username}!</h1><p>We're excited to have you join our learning platform.</p>`,
            });
            // Return both user and email info
            return {
                user,
                emailInfo: {
                    status: 'sent',
                    messageId: emailResult.messageId,
                    response: emailResult.response,
                },
            };
        }
        catch (error) {
            // Email failed but user was created
            return {
                user,
                emailInfo: {
                    status: 'failed',
                    message: 'Email could not be sent',
                },
            };
        }
    }
    async login(data) {
        const user = await config_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new httpException_1.default(401, 'Invalid credentials');
        }
        const isPasswordValid = await (0, hash_1.verifyPassword)(user.password, data.password);
        if (!isPasswordValid) {
            throw new httpException_1.default(401, 'Invalid credentials');
        }
        const { accessToken, refreshToken } = (0, authMiddleware_1.generateToken)(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    async changePassword(userId, data) {
        const user = await config_1.prisma.user.findUnique({
            where: { id: userId },
        });
        // !USER THROW -> HTTPEXCEPTION
        if (!user) {
            throw new httpException_1.default(404, 'User not found');
        }
        // user.password, data.oldPassword -> check compare.
        const isOldPassordValid = await (0, hash_1.verifyPassword)(user.password, data.oldPassword);
        if (!isOldPassordValid) {
            throw new httpException_1.default(400, 'Old password is incorrect');
        }
        // Check if oldPassword and newPassword are same
        if (data.oldPassword === data.newPassword) {
            throw new httpException_1.default(400, 'New password cannot be the same as the old password');
        }
        // user password -> update with hash.
        const hashedPassword = await (0, hash_1.hashPassword)(data.newPassword);
        // update password in db
        await config_1.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });
    }
    async updateProfile(userId, data) {
        const user = await config_1.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        // !USER THROW -> HTTPEXCEPTION
        if (!user) {
            throw new httpException_1.default(404, 'User not found');
        }
        if (!user.profile) {
            throw new httpException_1.default(404, 'Profile not found');
        }
        return await config_1.prisma.profile.update({
            where: {
                id: user.profile.id,
            },
            data: {
                ...(data.image && { image: data.image }), // best
                ...(data.bio && { bio: data.bio }),
            },
        });
    }
    async getUserWithProfile(userId) {
        const user = await config_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                courses: true,
            },
        });
        if (!user) {
            throw new httpException_1.default(404, 'User not found');
        }
        //
        return user;
    }
}
exports.default = new UserService();
