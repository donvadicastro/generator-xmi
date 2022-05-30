import {xmiInterface} from "../xmiInterface";
import xmiBase from "../xmiBase";
import {xmiParameter} from "./xmiParameter";
import {get} from "object-path";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const camel = require('to-camel-case');
const assert = require('assert');

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[] = [];
    isReturnArray: boolean = false;

    constructor(raw: any, parent: xmiInterface, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.refresh(raw);
    }

    get returnParameter(): xmiParameter {
        const returnParameter = this.parameters.find(x => x.name === 'return');
        assert(returnParameter, `Return parameter for operation "${this.name}" in class "${(<xmiBase>this.parent).name}" not defined`);

        //move return parameter into separate storage
        return <xmiParameter>returnParameter;
    }

    get inputParameters(): xmiParameter[] {
        return this.parameters.filter(x => x.name !== 'return');
    }

    refresh(raw: any): this {
        this.name = this.name && camel(this.name);
        this.description = this.description || get(raw, 'documentation.0.$.value');
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x, this, this._factory));

        if(get(raw, ['type','0','$', 'returnarray']) === '1') {
            this.isReturnArray = true;
        }

        return this;
    }
}
