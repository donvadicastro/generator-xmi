"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
Logger._instanse = null;
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map