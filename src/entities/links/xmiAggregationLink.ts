import {xmiLink} from "./xmiLink";
import xmiConnector from "../connectors/xmiConnector";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import xmiBase from "../xmiBase";
import {xmiInterface} from "../xmiInterface";

export class xmiAggregationLink extends xmiLink {
    connector: xmiConnector;

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.connector = this._factory.connectorHash[this.id];
    }
}
