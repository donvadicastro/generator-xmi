import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiPackage} from "../xmiPackage";
import {xmiComponent} from "../xmiComponent";
import {get} from "object-path";

export class xmiInOut extends xmiBase {
    owner?: xmiComponent;

    constructor(raw: any, parent: xmiPackage | null, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.refresh(raw, parent);
    }

    refresh(raw: any, parent: xmiPackage | null): this {
        const ownerId = <string>get(raw, 'model.0.$.owner');

        if(ownerId) {
            this._factory.resolveById(ownerId).subscribe(x => this.owner = <xmiComponent>x);
        }

        return this;
    }
}
