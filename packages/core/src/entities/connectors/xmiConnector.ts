import xmiConnectorParty from "./xmiConnectorParty";
import {IConnector} from "../../contracts/connector";
import {xmiClass} from "../xmiClass";
import {get} from "object-path";
import xmiBase from "../xmiBase";
import {forkJoin} from "rxjs";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export default class xmiConnector extends xmiBase implements IConnector {
    source: xmiConnectorParty;
    target: xmiConnectorParty;
    condition: string;

    constructor(raw: any, factory: xmiComponentFactory) {
        super(raw, null, factory);

        this.condition = get(raw, 'extendedProperties.0.$.conditional');
        this.source = new xmiConnectorParty(raw.source[0], factory);
        this.target = new xmiConnectorParty(raw.target[0], factory);

        // change resolve state once all children resolved
        forkJoin({
            source: this.source.onAfterInit,
            target: this.target.onAfterInit
        }).subscribe(() => this.initialized());
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
