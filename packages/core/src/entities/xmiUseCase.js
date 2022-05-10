"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiUseCase = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
const object_path_1 = require("object-path");
class xmiUseCase extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.scenarios = object_path_1.get(raw, ['EAModel.scenario', '0', 'EAScenario'], [])
            .map((x) => ({
            type: x.$.name,
            steps: object_path_1.get(x, ['EAScenarioContent', '0', 'path', '0', 'step'], []).map((x) => x.$.name)
        }));
    }
}
exports.xmiUseCase = xmiUseCase;
//# sourceMappingURL=xmiUseCase.js.map