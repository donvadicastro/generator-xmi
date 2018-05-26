import xmiBase from "./xmiBase";
import {xmiLifeline} from "./xmiLifeline";
import {get} from 'object-path';
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiMessage} from "./collaboration/xmiMessage";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";

export class xmiCollaboration extends xmiBase {
    lifelines: xmiLifeline[];
    fragments: xmiFragment[];
    attributes: xmiAttribute[];
    messages: xmiMessage[];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        this.attributes = (this.raw.ownedAttribute || [])
            .map((x: any) => new xmiAttribute(x, this));

        this.lifelines = get(this.raw, 'ownedBehavior.0.lifeline', [])
            .map((x: any) => new xmiLifeline(x, this, this.attributes));

        this.fragments = get(this.raw, 'ownedBehavior.0.fragment', [])
            .map((x: any) => new xmiFragment(x, this, this.lifelines));

        this.messages = get(this.raw, 'ownedBehavior.0.message', [])
            .map((x: any) => new xmiMessage(x, this, this.fragments));
    }
}
