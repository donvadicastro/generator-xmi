const camel = require('to-camel-case');

import xmiBase from "../xmiBase";
import {xmiClass} from "../xmiClass";
import {xmiParameter} from "./xmiParameter";

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[];

    constructor(raw: any, parent: xmiClass) {
        super(raw, parent);
        this.name = this.name && camel(this.name);
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x, this));
    }
}