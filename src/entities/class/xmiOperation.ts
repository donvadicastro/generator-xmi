import {xmiParameter} from "../xmiParameter";
import xmiBase from "../xmiBase";
import {xmiClass} from "../xmiClass";

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[];

    constructor(raw: any, parent: xmiClass) {
        super(raw, parent);
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x, this));
    }
}