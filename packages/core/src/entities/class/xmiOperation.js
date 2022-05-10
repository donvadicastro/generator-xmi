"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiOperation = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const xmiParameter_1 = require("./xmiParameter");
const object_path_1 = require("object-path");
const camel = require('to-camel-case');
const assert = require('assert');
class xmiOperation extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.parameters = [];
        this.isReturnArray = false;
        this.refresh(raw);
    }
    get returnParameter() {
        const returnParameter = this.parameters.find(x => x.name === 'return');
        assert(returnParameter, `Return parameter for operation "${this.name}" in class "${this.parent.name}" not defined`);
        //move return parameter into separate storage
        return returnParameter;
    }
    get inputParameters() {
        return this.parameters.filter(x => x.name !== 'return');
    }
    refresh(raw) {
        this.name = this.name && camel(this.name);
        this.description = this.description || object_path_1.get(raw, 'documentation.0.$.value');
        this.parameters = (raw.ownedParameter || []).map((x) => new xmiParameter_1.xmiParameter(x, this, this._factory));
        if (object_path_1.get(raw, ['type', '0', '$', 'returnarray']) === '1') {
            this.isReturnArray = true;
        }
        return this;
    }
}
exports.xmiOperation = xmiOperation;
//# sourceMappingURL=xmiOperation.js.map