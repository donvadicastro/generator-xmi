import xmiConnectorParty from "./xmiConnectorParty";
import {IConnector} from "../../contracts/connector";
import {xmiClass} from "../xmiClass";
import {get} from "object-path";

export default class xmiConnector implements IConnector {
    id: string;
    raw: any;

    source: xmiConnectorParty;
    target: xmiConnectorParty;
    condition: string;

    constructor(raw: any) {
        this.raw = raw;
        this.id = raw.$['xmi:idref'];

        this.condition = get(raw, 'extendedProperties.0.$.conditional');
        this.source = new xmiConnectorParty(raw.source[0]);
        this.target = new xmiConnectorParty(raw.target[0]);
    }

    /**
     * Transform connector to be directed from defined connection party (consider as a source).
     * @param source
     */
    getDirectedFrom(source: xmiClass): IConnector {
        return this.source.typeRef === source ? this :
            { condition: this.condition, source: this.target, target: this.source };
    }
}
