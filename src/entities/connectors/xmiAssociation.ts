import xmiBase from "../xmiBase";
import {xmiAssociationParty} from "./xmiAssociationParty";

export class xmiAssociation extends xmiBase {
    ownedEnds: xmiAssociationParty[];

    constructor(raw: any) {
        super(raw);
        this.ownedEnds = raw.ownedEnd.map((x: any) => new xmiAssociationParty(x));
    }
}
