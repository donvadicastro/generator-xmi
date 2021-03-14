import {get} from 'object-path';
import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiAssociationParty extends xmiBase {
    typeRef: xmiBase | undefined = undefined;
    value: {lower: number | string, upper: number | string};
    aggregation: 'composite' | 'none';

    constructor(raw: any, factory: xmiComponentFactory) {
        super(raw, null, factory);

        this.value = {lower: this.getValue(get(raw, 'lowerValue.0.$')), upper: this.getValue(get(raw, 'upperValue.0.$'))};
        this.aggregation = raw.$['aggregation'];

        this._factory.resolveById(get(raw, 'type.0.$.xmi:idref')).subscribe(x => this.typeRef = x);
    }

    getValue(value: any): number | string {
        switch ((value || {}).type) {
            case 'uml:LiteralInteger': value = parseInt(value.value); break;
            case 'uml:LiteralUnlimitedNatural': value = '*'; break;
            default: break;
        }

        return value;
    }
}
