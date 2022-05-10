"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiLink = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
class xmiLink extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this._factory.resolveById(raw.$.start).subscribe(x => this.start = x);
        this._factory.resolveById(raw.$.end).subscribe(x => this.end = x);
    }
}
exports.xmiLink = xmiLink;
//# sourceMappingURL=xmiLink.js.map