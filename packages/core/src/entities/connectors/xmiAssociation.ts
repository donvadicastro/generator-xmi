import xmiBase from "../xmiBase";
import {xmiAssociationParty} from "./xmiAssociationParty";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiAssociation extends xmiBase {
    ownedEnds: xmiAssociationParty[];

    constructor(raw: any, factory: xmiComponentFactory) {
        super(raw, null, factory);
        this.ownedEnds = raw.ownedEnd.map((x: any) => new xmiAssociationParty(x, factory));
    }
}
