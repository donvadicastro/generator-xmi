import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiClass} from "./xmiClass";

export class xmiInstanceSpecification extends xmiClass {
    get elementRef(): xmiClass {
        return <xmiClass>xmiComponentFactory.getByKey(this.raw.$.classifier);
    }
}
