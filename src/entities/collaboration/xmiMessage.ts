import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {xmiOperation} from "../class/xmiOperation";
import {xmiClass} from "../xmiClass";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponent} from "../xmiComponent";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const assert = require('assert');

export class xmiMessage extends xmiBase{
    get operation(): xmiOperation {
        return this.to && this.to.elementRef && (<xmiClass>this.to.elementRef).operations.filter(x => x.id === this.raw.$.signature)[0];
    }

    get from(): xmiLifeline | {elementRef: xmiComponent} {
        const f = xmiComponentFactory.instance.fragmentHash.filter(x => x.id === this.raw.$.sendEvent)[0];
        return f && f.lifelines[0];
    }

    get to(): xmiLifeline | {elementRef: xmiComponent} {
        const f = xmiComponentFactory.instance.fragmentHash.filter(x => x.id === this.raw.$.receiveEvent)[0];
        return f && f.lifelines[0];
    }

    toConsole() {
        console.log(xmiComponentFactory.instance.fragmentHash.length);
        console.log(this.name, !!this.from, !!this.to);
        this.from && assert(this.from.elementRef, `Null ref for message "${this.name}": from "${this.from.elementRef.name}" (${this.from.elementRef.id})`);
        this.to && assert(this.to.elementRef, `Null ref for message "${this.name}": to "${this.to.elementRef.name}" (${this.to.elementRef.id})`);
        assert(this.operation, `Operation should be specified for "${this.to && this.to.elementRef.name}" component: ${this.path.map(x => x.name).join(' -> ')}`);

        return {[this.name]: `${this.id} (${this.from && this.from.elementRef.name} - ${this.to && this.to.elementRef.name}::${this.operation.name})`};
    }
}
