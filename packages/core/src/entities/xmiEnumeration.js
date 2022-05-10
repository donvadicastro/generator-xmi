"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiEnumeration = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
class xmiEnumeration extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.literals = (raw.ownedLiteral || []).map((x) => x.$.name);
    }
}
exports.xmiEnumeration = xmiEnumeration;
//# sourceMappingURL=xmiEnumeration.js.map