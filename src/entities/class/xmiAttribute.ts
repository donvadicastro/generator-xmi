import {get} from "object-path";
import xmiBase from "../xmiBase";
import {xmiClass} from "../xmiClass";

export class xmiAttribute extends xmiBase {
    type: string;

    constructor(raw: any, parent: xmiBase) {
        super(raw, parent);
        this.type = get(raw, ['properties', '0', '$', 'type']) ||
            get(raw, ['type', '0', '$', 'xmi:idref']);
    }
}