import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiLink extends xmiBase {
    start: xmiBase | null;
    end: xmiBase | null;

    constructor(raw: any) {
        super(raw);

        this.start = xmiComponentFactory.getByKey(raw.$.start);
        this.end = xmiComponentFactory.getByKey(raw.$.end);
    }
}
