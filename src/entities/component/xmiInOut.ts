import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiPackage} from "../xmiPackage";
const assert = require('assert');

export class xmiInOut extends xmiBase {
    ref: xmiBase;

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        const id = this.raw.$['xmi:idref'] || this.id;
        assert(id, `Ref no specified for "${this.name}(${this.id}): ${this.path.map(x => x.name).join(' -> ')}"`);

        this.ref = xmiComponentFactory.getByKey(id);
        xmiComponentFactory.getByKeyDeffered(this, 'ref', id);
    }
}