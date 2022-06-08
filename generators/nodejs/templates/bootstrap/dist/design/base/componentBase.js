"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
"use strict";
const diTypes_1 = require("../types/diTypes");
const storage = require('node-persist');
const readline = __importStar(require("readline"));
const inversify_1 = require("inversify");
const inversify_config_1 = require("../../inversify.config");
let ComponentBase = class ComponentBase {
    initialize() {
    }
    notifyComplete(message, start) {
        const duration = Math.abs(+new Date() - +start);
        readline.moveCursor(process.stdout, 0, -1);
        process.stdout.write(`--> \x1b[42m${message}: ${duration} ms\x1b[m\n`);
    }
    saveState(state) {
        return storage.setItem(this.constructor.name, JSON.stringify(state));
    }
    loadState() {
        return JSON.parse(storage.getItem(this.constructor.name));
    }
};
__decorate([
    inversify_1.inject(diTypes_1.DITypes.ICommonDbManagerContract),
    __metadata("design:type", typeof (_a = typeof inversify_config_1.DbManagerProvider !== "undefined" && inversify_config_1.DbManagerProvider) === "function" ? _a : Object)
], ComponentBase.prototype, "dbManager", void 0);
ComponentBase = __decorate([
    inversify_1.injectable()
], ComponentBase);
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=componentBase.js.map