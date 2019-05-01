import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiPackage} from "../xmiPackage";
import {xmiComponent} from "../xmiComponent";
import {get} from "object-path";

const assert = require('assert');

export class xmiInOut extends xmiBase {
    ref: xmiBase | null = null;
    owner: xmiComponent | null = null;

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);
        this.refresh(raw, parent);
    }

    refresh(raw: any, parent?: xmiPackage): this {
        const id = raw.$['xmi:idref'];
        const ownerId = <string>get(raw, 'model.0.$.owner');
        assert(id, `Ref no specified for "${this.name}(${this.id}): ${this.path.map(x => x.name).join(' -> ')}"`);

        this.ref = xmiComponentFactory.getByKey(id);
        xmiComponentFactory.getByKeyDeffered(this, 'ref', id);

        if(ownerId) {
            this.owner = <xmiComponent>xmiComponentFactory.getByKey(ownerId);
            xmiComponentFactory.getByKeyDeffered(this, 'owner', ownerId);
        }

        return this;
    }
}
