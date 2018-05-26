import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {xmiOperation} from "../class/xmiOperation";
import {xmiClass} from "../xmiClass";
import {xmiLifeline} from "../xmiLifeline";

export class xmiMessage extends xmiBase{
    from: xmiLifeline;
    to: xmiLifeline;

    get operation(): xmiOperation {
        return this.to && this.to.elementRef && (<xmiClass>this.to.elementRef).operations.filter(x => x.id === this.raw.$.signature)[0];
    }

    constructor(raw: any, parent: xmiBase, fragments: xmiFragment[]) {
        super(raw, parent);

        const fromFragment = fragments.filter(x => x.id === raw.$.sendEvent)[0];
        const toFragment = fragments.filter(x => x.id === raw.$.receiveEvent)[0];

        this.from = fromFragment && fromFragment.lifeline;
        this.to = toFragment && toFragment.lifeline;
    }
}