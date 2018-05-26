import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiPackage} from "../xmiPackage";

export class xmiFragment extends xmiBase {
    lifeline: xmiLifeline;

    constructor(raw: any, parent: xmiBase, lifelines: xmiLifeline[]) {
        super(raw, parent);
        this.lifeline = lifelines.filter(x => x.id === raw.$.covered)[0];
    }
}