import {get} from 'object-path';
import {xmiClass} from "../xmiClass";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export default class xmiConnectorParty {
    raw: any;
    id: string;
    typeRef: xmiClass | null = null;
    multiplicity: string;

    constructor(raw: any) {
        this.raw = raw;
        this.id = raw.$['xmi:idref'];
        this.multiplicity = get(raw, ['type', '0', '$', 'multiplicity']);

        xmiComponentFactory.getByKeyDeffered(this, 'typeRef', this.id);
    }
}