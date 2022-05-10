"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiMessage = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const rxjs_1 = require("rxjs");
const assert = require('assert');
class xmiMessage extends xmiBase_1.default {
    /**
     * Source for FROM fragment
     * @private
     */
    get fromSource() {
        return this._factory.fragmentHash.filter(x => x.id === this._raw.$.sendEvent)[0];
    }
    /**
     * Source for TO fragment
     * @private
     */
    get toSource() {
        return this._factory.fragmentHash.filter(x => x.id === this._raw.$.receiveEvent)[0];
    }
    get operation() {
        return this.to && this.to.elementRef && this.to.elementRef.operations.filter(x => x.id === this._raw.$.signature)[0];
    }
    get from() {
        const f = this.fromSource;
        return f && f.lifelines[0];
    }
    /**
     * Get operand in combined fragment where this start message belongs to (e.g. loop)
     */
    get fromOperand() {
        const f = this.fromSource;
        return (f && f.operands.length) ? f.operands[0] : null;
    }
    get to() {
        const f = this.toSource;
        return f && f.lifelines[0];
    }
    /**
     * Get operand in combined fragment where this end message belongs to (e.g. loop)
     */
    get toOperand() {
        const f = this.toSource;
        return (f && f.operands.length) ? f.operands[0] : null;
    }
    get connector() {
        return this._factory.connectorHash[this.id];
    }
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        //set reference to source when condition is used
        if (this.connector.condition) {
            rxjs_1.forkJoin([this.fromSource.onAfterInit, this.toSource.onAfterInit])
                .subscribe(() => {
                assert(this.from, `Source component for message "${this.name}" not exists`);
                assert(this.to, `Target component for message "${this.name}" not exists`);
                rxjs_1.forkJoin([this.from.onAfterInit, this.to.onAfterInit]).subscribe((val) => {
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
        assert(this.operation, `Operation should be specified for "${this.to && this.to.elementRef.name}" component: ${this.pathToRoot.map(x => x.name).join(' -> ')}`);
        assert(this.connector, `Connector should be attached to message "${this.name}"`);
        return { [this.name]: `${this.id} (${this.from && this.from.elementRef.name} - ${this.to && this.to.elementRef.name}::${this.operation.name})` };
    }
}
exports.xmiMessage = xmiMessage;
//# sourceMappingURL=xmiMessage.js.map