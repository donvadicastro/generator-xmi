import {xmiLink} from "./xmiLink";
import xmiConnector from "../connectors/xmiConnector";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiAggregationLink extends xmiLink {
    connector: xmiConnector;

    constructor(raw: any) {
        super(raw, null);
        this.connector = xmiComponentFactory.instance.connectorHash[this.id];
    }
}