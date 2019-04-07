import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import xmiBase from "./xmiBase";
import {xmiClass} from "./xmiClass";

export class xmiInstanceSpecification extends xmiBase {
    get elementRef(): xmiClass {
        return <xmiClass>xmiComponentFactory.getByKey(this.raw.$.classifier);
    }
}
