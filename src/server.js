"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
const router_1 = __importDefault(require("./router"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT ?? 7000;
const app = (0, express_1.default)();
// ✅ Custom morgan token for timestamp
morgan_1.default.token('timestamp', () => new Date().toISOString());
// ✅ Morgan format string
const morganFormat = ':method :url :status :res[content-length] - :response-time ms [:timestamp]';
// ✅ Enable morgan logging for all requests
app.use((0, morgan_1.default)(morganFormat));
void (async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
    }
    catch (error) {
        console.log(`ERROR CONNECTING DATABASE: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
})();
app.use(express_1.default.json());
app.use('/api/v1', router_1.default);
app.use(globalErrorHandler_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
