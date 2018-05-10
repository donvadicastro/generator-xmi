import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiInOut extends xmiBase {
    get ref(): xmiBase | null {
        return xmiComponentFactory.getByKey(this.raw.$['xmi:idref']);
    }
}