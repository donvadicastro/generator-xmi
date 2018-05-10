import {xmiParameter} from "../xmiParameter";
import xmiBase from "../xmiBase";

export class xmiOperation extends xmiBase {
    parameters: xmiParameter[];

    constructor(raw: any) {
        super(raw);
        this.parameters = (raw.ownedParameter || []).map((x: any) => new xmiParameter(x));
    }
}