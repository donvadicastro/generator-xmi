import {get} from 'object-path';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiClass} from "../xmiClass";
import xmiBase from "../xmiBase";
import {Subject} from "rxjs";

export default class xmiConnectorParty extends xmiBase {
    multiplicity: string;
    aggregation: 'none' | 'composite' | 'shared';
    typeRef?: xmiClass;

    constructor(raw: any, factory: xmiComponentFactory) {
        super(raw, null, factory);

        this.multiplicity = get(raw, 'type.0.$.multiplicity');
        this.aggregation = get(raw, 'type.0.$.aggregation', 'none');

        this._factory.resolveById(this.id).subscribe(x => {
            this.typeRef = <xmiClass>x;
            this.initialized();
        });
    }
}
