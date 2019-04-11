import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiClass} from "./xmiClass";
import {xmiComponent} from "./xmiComponent";
import {xmiActor} from "./xmiActor";
import {xmiInstanceSpecification} from "./xmiInstanceSpecification";

export class xmiLifeline extends xmiBase {
    attribute: string;
    ref: xmiClass | xmiComponent | xmiActor | xmiInstanceSpecification;

    get elementRef(): xmiClass | xmiComponent | xmiActor {
        return (this.ref instanceof xmiInstanceSpecification) ? (<xmiInstanceSpecification>this.ref).elementRef : this.ref;
    }

    constructor(raw: any, parent: xmiBase, attributes: xmiAttribute[]) {
        super(raw, parent);

        this.attribute = attributes.filter(x => x.id === raw.$.represents)[0].type;
        this.ref = <xmiClass>xmiComponentFactory.getByKey(this.attribute);

        xmiComponentFactory.getByKeyDeffered(this, 'ref', this.attribute);
    }

    toConsole() {
        return {[this.name]: (<xmiClass>this.ref).fragments.length };
    }
}
