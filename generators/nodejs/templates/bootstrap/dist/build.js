"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;
shelljs_1.default.rm('-rf', outDir);
shelljs_1.default.mkdir(outDir);
shelljs_1.default.mkdir('-p', `${outDir}/api/public`);
shelljs_1.default.cp('.env', `${outDir}/.env`);
shelljs_1.default.cp('package.json', `${outDir}/package.json`);
shelljs_1.default.cp('ormconfig.json', `${outDir}/ormconfig.json`);
shelljs_1.default.cp('-r', 'api/public', `${outDir}/api`);
shelljs_1.default.mkdir('-p', `${outDir}/api/server/swagger/swagger`);
shelljs_1.default.cp('api/server/swagger/api.yaml', `${outDir}/api/server/swagger/api.yaml`);
shelljs_1.default.exec(`cd ${outDir} && tsc`);
//# sourceMappingURL=build.js.map