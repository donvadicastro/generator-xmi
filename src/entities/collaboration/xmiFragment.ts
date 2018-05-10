import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";

export class xmiFragment extends xmiBase {
    lifeline: xmiLifeline;

    constructor(raw: any, lifelines: xmiLifeline[]) {
        super(raw);
        this.lifeline = lifelines.filter(x => x.id === raw.$.covered)[0];
    }
}