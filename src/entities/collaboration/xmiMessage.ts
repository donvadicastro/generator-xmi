import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {xmiOperation} from "../class/xmiOperation";
import {xmiClass} from "../xmiClass";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponent} from "../xmiComponent";

const assert = require('assert');

export class xmiMessage extends xmiBase{
    from: xmiLifeline | {elementRef: xmiComponent};
    to: xmiLifeline | {elementRef: xmiComponent};

    get operation(): xmiOperation {
        return this.to && this.to.elementRef && (<xmiClass>this.to.elementRef).operations.filter(x => x.id === this.raw.$.signature)[0];
    }

    constructor(raw: any, parent: xmiBase, fragments: xmiFragment[]) {
        super(raw, parent);

        const fromFragment = fragments.filter(x => x.id === raw.$.sendEvent)[0];
        const toFragment = fragments.filter(x => x.id === raw.$.receiveEvent)[0];

        this.from = fromFragment && fromFragment.lifelines[0];
        this.to = toFragment && toFragment.lifelines[0];
    }

    toConsole() {
        this.from && assert(this.from.elementRef, `Null ref for message "${this.name}": from "${this.from.elementRef.name}" (${this.from.elementRef.id})`);
        this.to && assert(this.to.elementRef, `Null ref for message "${this.name}": to "${this.to.elementRef.name}" (${this.to.elementRef.id})`);
        assert(this.operation, `Operation should be specified for "${this.to.elementRef.name}" component: ${this.path.map(x => x.name).join(' -> ')}`);

        return {[this.name]: `${this.id} (${this.from && this.from.elementRef.name} - ${this.to && this.to.elementRef.name}::${this.operation.name})`};
    }
}