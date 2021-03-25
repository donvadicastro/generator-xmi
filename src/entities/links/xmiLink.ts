import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiLink extends xmiBase {
    start?: xmiBase;
    end?: xmiBase;

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this._factory.resolveById(raw.$.start).subscribe(x => this.start = x);
        this._factory.resolveById(raw.$.end).subscribe(x => this.end = x);
    }
}
