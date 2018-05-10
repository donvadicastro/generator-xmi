import {get} from "object-path";
import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiAttribute extends xmiBase {
    type: string;

    constructor(raw: any) {
        super(raw);
        this.type = get(raw, ['properties', '0', '$', 'type']) ||
            get(raw, ['type', '0', '$', 'xmi:idref']);
    }
}