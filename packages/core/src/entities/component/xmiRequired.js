"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiRequired = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const assert = require('assert');
class xmiRequired extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        const typeRefId = raw.$['xmi:idref'];
        const linkRefId = raw.$['xmi:id'];
        assert(typeRefId, `There is no required or provided interface specified for "${parent.name} -> ${parent.pathToRoot.map(x => x.name).join(' -> ')}" component`);
        this._factory.resolveById(linkRefId).subscribe(x => this.linkRef = x);
        this._factory.resolveById(typeRefId).subscribe(x => this.typeRef = x);
    }
}
exports.xmiRequired = xmiRequired;
//# sourceMappingURL=xmiRequired.js.map