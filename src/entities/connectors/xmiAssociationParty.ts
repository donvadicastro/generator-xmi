import {get} from 'object-path';
import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiAssociationParty extends xmiBase {
    typeRef: xmiBase | null = null;
    value: {lower: number | string, upper: number | string};
    aggregation: 'composite' | 'none';

    constructor(raw: any) {
        super(raw);

        this.value = {lower: this.getValue(get(raw, 'lowerValue.0.$')), upper: this.getValue(get(raw, 'upperValue.0.$'))};
        this.aggregation = raw.$['aggregation'];

        xmiComponentFactory.getByKeyDeffered(this, 'typeRef', get(raw, 'type.0.$.xmi:idref'));
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
