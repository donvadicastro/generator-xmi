import xmiBase from "./xmiBase";
import {xmiPackage} from "./xmiPackage";

export class xmiParameter extends xmiBase {
    type: string;

    constructor(raw: any, parent: xmiBase) {
        super(raw, parent);
        this.type = raw.$.type;
    }
}