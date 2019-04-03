import {xmiInterface} from "./xmiInterface";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";
import {xmiAggregationLink} from "./links/xmiAggregationLink";
import {LinkType} from "../types/linkType";
import xmiConnectorParty from "./connectors/xmiConnectorParty";

export class xmiClass extends xmiInterface {
    links: LinkType = {sequence: [], usage: [], aggregation: [], association: [], generalization: []};
    fragments: xmiFragment[] = [];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        if(raw.links && raw.links.length && raw.links[0].Aggregation) {
            this.links.aggregation = raw.links[0].Aggregation.map((x: any) => new xmiAggregationLink(x));
        }

        if(raw.links && raw.links.length && raw.links[0].Association) {
            this.links.association = raw.links[0].Association.map((x: any) => new xmiAggregationLink(x));
        }

        if(raw.links && raw.links.length && raw.links[0].Generalization) {
            this.links.generalization = raw.links[0].Generalization.map((x: any) => new xmiAggregationLink(x));
        }
    }

    get associations(): xmiConnectorParty[] {
        return this.getConnections('association');
    }

    get generalizations(): xmiConnectorParty[] {
        return this.getConnections('generalization');
    }

    private getConnections(type: 'association' | 'generalization') {
        return this.links[type].map((x: xmiAggregationLink) =>
            x.connector.source.typeRef === this ? x.connector.target : x.connector.source);
    }
}
