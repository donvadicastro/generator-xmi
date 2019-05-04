import xmiBase from "./xmiBase";
import {xmiPackage} from "./xmiPackage";

export class xmiEnumeration extends xmiBase {
    literals: string[];

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);
        this.literals = (raw.ownedLiteral || []).map((x: any) => x.$.name);
    }
}
