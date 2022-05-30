import xmiBase from "./xmiBase";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiEnumeration extends xmiBase {
    literals: string[];

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.literals = (raw.ownedLiteral || []).map((x: any) => x.$.name);
    }
}
