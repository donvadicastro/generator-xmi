import {xmiFragment} from "./xmiFragment";
import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiOperand} from "./xmiOperand";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiCombinedFragment extends xmiFragment {
    override operands: xmiOperand[];

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory, lifelines: xmiLifeline[]) {
        super(raw, parent, factory, lifelines);
        this.operands = raw.operand.map((x: any) => new xmiOperand(x, this, lifelines, factory));
    }
}
