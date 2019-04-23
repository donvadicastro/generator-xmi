import {xmiInterface} from "../xmiInterface";
import xmiBase from "../xmiBase";
import {xmiParameter} from "./xmiParameter";

const camel = require('to-camel-case');
const assert = require('assert');

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[];

    constructor(raw: any, parent: xmiInterface) {
        super(raw, parent);
        this.name = this.name && camel(this.name);
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x, this));
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
}
