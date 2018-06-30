import {xmiInterface} from "../xmiInterface";
import xmiBase from "../xmiBase";
import {xmiParameter} from "./xmiParameter";

const camel = require('to-camel-case');

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[];

    constructor(raw: any, parent: xmiInterface) {
        super(raw, parent);
        this.name = this.name && camel(this.name);
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x, this));
    }
}