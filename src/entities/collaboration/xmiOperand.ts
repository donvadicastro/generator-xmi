import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {get} from "object-path";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiLifeline} from "../xmiLifeline";

export class xmiOperand extends xmiBase {
    fragments: xmiFragment[] = [];

    constructor(raw: any, parent?: xmiFragment, lifelines?: xmiLifeline[]) {
        super(raw, parent);

        this.description = get(this.raw, ['guard', '0', 'specification', '0', '$', 'body']);
        this.fragments = get(this.raw, 'fragment', [])
            .map((x: any) => <xmiFragment>xmiComponentFactory.get(x, undefined, lifelines));
    }
}
