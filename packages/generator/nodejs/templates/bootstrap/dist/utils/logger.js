"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston = __importStar(require("winston"));
class Logger {
    constructor() {
        this._logger = winston.createLogger({
            format: winston.format.simple(),
            transports: [
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'info.log' })
            ]
        });
        // this._logger.add(new winston.transports.Console({
        //     format: winston.format.simple()
        // }));
    }
    static get instanse() {
        if (!this._instanse) {
            this._instanse = new Logger();
        }
        return this._instanse;
    }
    static log(message) {
        this.instanse.log(message);
        return this.instanse;
    }
    static error(message) {
        this.instanse.error(message);
        return this.instanse;
    }
    log(message) {
        this._logger.log({ level: 'info', message: message });
    }
    error(message) {
        this._logger.log({ level: 'error', message: message });
    }
}
exports.Logger = Logger;
Logger._instanse = null;
//# sourceMappingURL=logger.js.map