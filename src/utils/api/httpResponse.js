"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
class HttpResponse {
    constructor({ statusCode, message, data, docs, others, stack, pagination, }) {
        statusCode = statusCode ?? 200;
        if (statusCode >= 300) {
            this.success = false;
        }
        else {
            this.success = true;
        }
        this.message = message;
        this.data = data;
        this.docs = docs;
        this.others = others;
        this.stack = stack;
        this.pagination = pagination;
    }
}
exports.HttpResponse = HttpResponse;
