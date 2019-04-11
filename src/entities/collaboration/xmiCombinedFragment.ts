import {xmiFragment} from "./xmiFragment";
import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiOperand} from "./xmiOperand";

export class xmiCombinedFragment extends xmiFragment {
    operands: xmiOperand[];

    constructor(raw: any, parent: xmiBase, lifelines: xmiLifeline[]) {
        super(raw, parent, lifelines);
        this.operands = raw.operand.map((x: any) => new xmiOperand(x, this, lifelines));
    }
}
