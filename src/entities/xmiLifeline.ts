import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiClass} from "./xmiClass";
import {xmiComponent} from "./xmiComponent";
import {xmiActor} from "./xmiActor";

export class xmiLifeline extends xmiBase {
    elementRef: xmiClass | xmiComponent | xmiActor;

    constructor(raw: any, attributes: xmiAttribute[]) {
        super(raw);
        this.elementRef = xmiComponentFactory.getByKey(attributes.filter(x => x.id === raw.$.represents)[0].type);
    }
}