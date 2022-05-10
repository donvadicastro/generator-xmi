"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiOperand = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const object_path_1 = require("object-path");
class xmiOperand extends xmiBase_1.default {
    constructor(raw, parent, lifelines, factory) {
        super(raw, parent, factory);
        this.fragments = [];
        this.description = object_path_1.get(this._raw, ['guard', '0', 'specification', '0', '$', 'body']);
        this.fragments = object_path_1.get(this._raw, 'fragment', [])
            .map((x) => {
            const fragment = this._factory.get(x, undefined, lifelines);
            fragment.operands.push(this);
            return fragment;
        });
    }
}
exports.xmiOperand = xmiOperand;
//# sourceMappingURL=xmiOperand.js.map