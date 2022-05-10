"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiLifeline = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
const xmiInstanceSpecification_1 = require("./xmiInstanceSpecification");
class xmiLifeline extends xmiBase_1.default {
    constructor(raw, parent, factory, attributes) {
        super(raw, parent, factory);
        this.attribute = attributes.filter(x => x.id === raw.$.represents)[0].typeId;
        this._factory.resolveById(this.attribute).subscribe(x => {
            this.ref = x;
            this.initialized();
        });
    }
    get elementRef() {
        return (this.ref instanceof xmiInstanceSpecification_1.xmiInstanceSpecification) ? this.ref.elementRef : this.ref;
    }
    toConsole() {
        return { [this.name]: this.ref.fragments.length };
    }
}
exports.xmiLifeline = xmiLifeline;
//# sourceMappingURL=xmiLifeline.js.map