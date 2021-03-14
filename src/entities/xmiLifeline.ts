import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiComponent} from "./xmiComponent";
import {xmiActor} from "./xmiActor";
import {xmiInstanceSpecification} from "./xmiInstanceSpecification";
import {xmiClass} from "./xmiClass";
import {xmiAbstractClass} from "../base/xmiAbstractClass";

export class xmiLifeline extends xmiBase {
    attribute: string;
    ref?: xmiClass | xmiComponent | xmiActor | xmiInstanceSpecification;

    get elementRef(): xmiAbstractClass | xmiInstanceSpecification {
        return (this.ref instanceof xmiInstanceSpecification) ? (<xmiInstanceSpecification>this.ref).elementRef : <xmiAbstractClass>this.ref;
    }

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory, attributes: xmiAttribute[]) {
        super(raw, parent, factory);

        this.attribute = attributes.filter(x => x.id === raw.$.represents)[0].type;
        this._factory.resolveById(this.attribute).subscribe(x => {
            this.ref = <any>x;
            this.initialized();
        });
    }

    toConsole() {
        return {[this.name]: (<xmiClass>this.ref).fragments.length };
    }
}
