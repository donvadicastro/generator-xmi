"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiCombinedFragment = void 0;
const xmiFragment_1 = require("./xmiFragment");
const xmiOperand_1 = require("./xmiOperand");
class xmiCombinedFragment extends xmiFragment_1.xmiFragment {
    constructor(raw, parent, factory, lifelines) {
        super(raw, parent, factory, lifelines);
        this.operands = raw.operand.map((x) => new xmiOperand_1.xmiOperand(x, this, lifelines, factory));
    }
}
exports.xmiCombinedFragment = xmiCombinedFragment;
//# sourceMappingURL=xmiCombinedFragment.js.map