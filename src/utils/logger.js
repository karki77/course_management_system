"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerStream = exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
exports.logger = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms');
exports.loggerStream = {
    write: (message) => {
        // eslint-disable-next-line no-console
        console.log(message.trim());
    },
    error: (message) => {
        console.error(message.trim());
    },
};
