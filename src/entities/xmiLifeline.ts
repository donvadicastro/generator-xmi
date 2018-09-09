import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiClass} from "./xmiClass";
import {xmiComponent} from "./xmiComponent";
import {xmiActor} from "./xmiActor";

export class xmiLifeline extends xmiBase {
    attribute: string;
    elementRef: xmiClass | xmiComponent | xmiActor;

    constructor(raw: any, parent: xmiBase, attributes: xmiAttribute[]) {
        super(raw, parent);

        this.attribute = attributes.filter(x => x.id === raw.$.represents)[0].type;
        this.elementRef = <xmiClass>xmiComponentFactory.getByKey(this.attribute);

        xmiComponentFactory.getByKeyDeffered(this, 'elementRef', this.attribute);
    }

    toConsole() {
        return {[this.name]: this.elementRef.fragments.length };
    }
}