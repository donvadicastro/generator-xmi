"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = __importDefault(require("./swagger"));
const logger_1 = __importDefault(require("./logger"));
const keycloak_1 = __importDefault(require("./config/keycloak"));
const session = require('express-session');
const root = path_1.default.normalize(__dirname + '/..');
const solutionRoot = path_1.default.normalize(root + '/..');
const pino = require('express-pino-logger')({ logger: logger_1.default });
const app = express_1.default();
const cors = require('cors');
const ormConfig = require('../../ormconfig.json');
const env = process.env;
class ExpressServer {
    constructor() {
        app.set('appPath', root + 'client');
        app.use(session({ secret: env.SESSION_SECRET, resave: false, saveUninitialized: true }));
        app.use(keycloak_1.default.middleware());
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(cookie_parser_1.default(env.SESSION_SECRET));
        app.use(express_1.default.static(`${root}/public`));
        app.use(cors());
        app.use(pino);
    }
    router(routes) {
        swagger_1.default(app, routes);
        return this;
    }
    listen(port = parseInt(env.SERVER_PORT || '3000')) {
        return __awaiter(this, void 0, void 0, function* () {
            //fix ORM entities path
            ormConfig.entities = ormConfig.entities.map((x) => `${solutionRoot}/${x}`);
            ormConfig.subscribers = ormConfig.subscribers.map((x) => `${solutionRoot}/${x}`);
            const welcome = (port) => () => logger_1.default.info(`API service up and running in ${env.NODE_ENV || 'development'} @: ${os_1.default.hostname()} on port: ${port}}`);
            http_1.default.createServer(app).listen(port, welcome(port));
            return app;
        });
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map