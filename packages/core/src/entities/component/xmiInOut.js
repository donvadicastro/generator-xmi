"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiInOut = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const object_path_1 = require("object-path");
class xmiInOut extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.refresh(raw, parent);
    }
    refresh(raw, parent) {
        const ownerId = object_path_1.get(raw, 'model.0.$.owner');
        if (ownerId) {
            this._factory.resolveById(ownerId).subscribe(x => this.owner = x);
        }
        return this;
    }
}
exports.xmiInOut = xmiInOut;
//# sourceMappingURL=xmiInOut.js.map