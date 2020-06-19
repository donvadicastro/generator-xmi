import {get} from 'object-path';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiClass} from "../xmiClass";

export default class xmiConnectorParty {
    raw: any;
    id: string;
    multiplicity: string;
    aggregation: 'none' | 'composite';
    typeRef?: xmiClass;

    constructor(raw: any) {
        this.raw = raw;
        this.id = raw.$['xmi:idref'];
        this.multiplicity = get(raw, 'type.0.$.multiplicity');
        this.aggregation = get(raw, 'type.0.$.aggregation', 'none');

        xmiComponentFactory.getByKeyDeffered(this, 'typeRef', this.id);
    }
}
