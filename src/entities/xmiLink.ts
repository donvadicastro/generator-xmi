import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiLink extends xmiBase {
    start: xmiBase | null = null;
    end: xmiBase | null = null;

    constructor(raw: any) {
        super(raw);

        xmiComponentFactory.getByKeyDeffered(this, 'start', raw.$.start);
        xmiComponentFactory.getByKeyDeffered(this, 'end', raw.$.end);
    }
}
