import xmiBase from "../xmiBase";
import {xmiAssociationParty} from "./xmiAssociationParty";

export class xmiAssociation extends xmiBase {
    ownedEnds: xmiAssociationParty[];

    constructor(raw: any) {
        super(raw, null);
        this.ownedEnds = raw.ownedEnd.map((x: any) => new xmiAssociationParty(x));
    }
}