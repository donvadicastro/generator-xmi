"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const l = (0, pino_1.default)({
    name: process.env.APP_ID || 'application-id',
    level: process.env.LOG_LEVEL || 'debug',
    prettyPrint: { forceColor: true }
});
exports.default = l;
//# sourceMappingURL=logger.js.map