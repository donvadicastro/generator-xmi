import xmiBase from "../xmiBase";
import {xmiFragment} from "./xmiFragment";
import {get} from "object-path";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiLifeline} from "../xmiLifeline";
import {xmiInterface} from "../xmiInterface";

export class xmiOperand extends xmiBase {
    fragments: xmiFragment[] = [];

    constructor(raw: any, parent: xmiFragment, lifelines: xmiLifeline[], factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this.description = get(this._raw, ['guard', '0', 'specification', '0', '$', 'body']);
        this.fragments = get(this._raw, 'fragment', [])
            .map((x: any) => {
                const fragment = <xmiFragment>this._factory.get(x, undefined, lifelines);
                fragment.operands.push(this);

                return fragment;
            });
    }
}
