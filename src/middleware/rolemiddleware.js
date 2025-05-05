"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const httpException_1 = __importDefault(require("../utils/api/httpException"));
const config_1 = require("../../src/config");
const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.email) {
                throw new httpException_1.default(401, 'Unauthenticated');
            }
            const user = await config_1.prisma.user.findUnique({
                where: { email: req.user.email },
            });
            // user role
            if (!user) {
                throw new httpException_1.default(401, 'Unauthenticated');
            }
            const userRole = req.user.role;
            const hasPermission = allowedRoles.includes(userRole);
            if (!hasPermission) {
                throw new httpException_1.default(403, 'Forbidden');
            }
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.roleMiddleware = roleMiddleware;
