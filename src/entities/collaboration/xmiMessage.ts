import xmiBase from "../xmiBase";
import {xmiOperation} from "../class/xmiOperation";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponent} from "../xmiComponent";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import xmiConnector from "../connectors/xmiConnector";
import {xmiCollaboration} from "../xmiCollaboration";
import {xmiClass} from "../xmiClass";
import {xmiOperand} from "./xmiOperand";
import {forkJoin, Observable} from "rxjs";
import {xmiFragment} from "./xmiFragment";

const assert = require('assert');

export class xmiMessage extends xmiBase {
    /**
     * Source for FROM fragment
     * @private
     */
    private get fromSource(): xmiFragment {
        return this._factory.fragmentHash.filter(x => x.id === this._raw.$.sendEvent)[0];
    }

    /**
     * Source for TO fragment
     * @private
     */
    private get toSource(): xmiFragment {
        return this._factory.fragmentHash.filter(x => x.id === this._raw.$.receiveEvent)[0];
    }

    get operation(): xmiOperation {
        return this.to && this.to.elementRef && (<xmiClass>this.to.elementRef).operations.filter(x => x.id === this._raw.$.signature)[0];
    }

    get from(): xmiLifeline | {onAfterInit: Observable<void>, elementRef: xmiComponent} {
        const f = this.fromSource;
        return f && f.lifelines[0];
    }

    /**
     * Get operand in combined fragment where this start message belongs to (e.g. loop)
     */
    get fromOperand(): xmiOperand | null {
        const f = this.fromSource;
        return (f && f.operands.length) ? f.operands[0] : null;
    }

    get to(): xmiLifeline | {onAfterInit: Observable<void>, elementRef: xmiComponent} {
        const f = this.toSource;
        return f && f.lifelines[0];
    }

    /**
     * Get operand in combined fragment where this end message belongs to (e.g. loop)
     */
    get toOperand(): xmiOperand | null {
        const f = this.toSource;
        return (f && f.operands.length) ? f.operands[0] : null;
    }

    get connector(): xmiConnector {
        return this._factory.connectorHash[this.id];
    }

    constructor(raw: any, parent: xmiCollaboration, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        //set reference to source when condition is used
        if (this.connector.condition) {
            forkJoin([this.fromSource.onAfterInit, this.toSource.onAfterInit])
                .subscribe(() => {
                    assert(this.from, `Source component for message "${this.name}" not exists`);
                    assert(this.to, `Target component for message "${this.name}" not exists`);

                    forkJoin([this.from.onAfterInit, this.to.onAfterInit]).subscribe((val) => {
                        assert(this.from.elementRef, `Source component reference for message "${this.name}" not exists`);
                        assert(this.to.elementRef, `Target component reference for message "${this.name}" not exists`);

                        //link condition with operation that will be affected by this condition.
                        const key = `${this.to.elementRef.name}_${this.operation.name}`;
                        this.from.elementRef.conditions[key] || (this.from.elementRef.conditions[key] = []);
                        this.from.elementRef.conditions[key].push(this.connector.condition);
                    });
                });
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
