import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {xmiOperation} from "../class/xmiOperation";
import {xmiClass} from "../xmiClass";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponent} from "../xmiComponent";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import xmiConnector from "../connectors/xmiConnector";
import {xmiCollaboration} from "../xmiCollaboration";

const assert = require('assert');

export class xmiMessage extends xmiBase {
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

    get connector(): xmiConnector {
        return xmiComponentFactory.instance.connectorHash[this.id];
    }

    constructor(raw: any, parent?: xmiCollaboration) {
        super(raw, parent);

        //set reference to source when condition is used
        if (this.connector.condition) {
            const from = this.from;
            const to = this.to;
            const operation = this.operation;

            assert(from, `Source component for message "${this.name}" not exists`);
            assert(from.elementRef, `Source component reference for message "${this.name}" not exists`);

            assert(to, `Target component for message "${this.name}" not exists`);
            assert(to.elementRef, `Target component reference for message "${this.name}" not exists`);

            //link condition with operation that will be affected by this condition.
            const key = `${to.elementRef.name}_${operation.name}`;
            from.elementRef.conditions[key] || (from.elementRef.conditions[key] = []);
            from.elementRef.conditions[key].push(this.connector.condition);
        }
    }

    toConsole() {
        this.from && assert(this.from.elementRef, `Null ref for message "${this.name}": from "${this.from.elementRef.name}" (${this.from.elementRef.id})`);
        this.to && assert(this.to.elementRef, `Null ref for message "${this.name}": to "${this.to.elementRef.name}" (${this.to.elementRef.id})`);

        assert(this.operation, `Operation should be specified for "${this.to && this.to.elementRef.name}" component: ${this.path.map(x => x.name).join(' -> ')}`);
        assert(this.connector, `Connector should be attached to message "${this.name}"`);

        return {[this.name]: `${this.id} (${this.from && this.from.elementRef.name} - ${this.to && this.to.elementRef.name}::${this.operation.name})`};
    }
}
