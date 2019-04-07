import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import xmiBase from "./xmiBase";

export class xmiInstanceSpecification extends xmiBase {
    get elementRef(): xmiBase {
        return xmiComponentFactory.getByKey(this.raw.$.classifier);
    }
}
