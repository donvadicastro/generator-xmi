import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiPackage} from "./xmiPackage";

export class xmiLink extends xmiBase {
    start: xmiBase | null = null;
    end: xmiBase | null = null;

    constructor(raw: any, parent: xmiBase) {
        super(raw, parent);

        xmiComponentFactory.getByKeyDeffered(this, 'start', raw.$.start);
        xmiComponentFactory.getByKeyDeffered(this, 'end', raw.$.end);
    }
}
