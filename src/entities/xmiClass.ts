import {xmiInterface} from "./xmiInterface";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";
import {xmiAggregationLink} from "./links/xmiAggregationLink";
import {LinkType} from "../types/linkType";
import xmiConnectorParty from "./connectors/xmiConnectorParty";
import {xmiGeneralization} from "./connectors/xmiGeneralization";
import xmiBase from "./xmiBase";
const assert = require('assert');

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

    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get associationLinks(): xmiConnectorParty[] {
        return this.getConnections('association');
    }

    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get generalizationLinks(): xmiConnectorParty[] {
        return this.getConnections('generalization');
    }

    /**
     * Generalization link, when arrow from current element
     */
    get generalizationLinksTo(): xmiBase | null {
        const links = this.generalization ?
            this.links.generalization.filter(x => x.start === this) : [];

        assert(links.length <= 1, `Class "${this.nameOrigin}" can have no more than 1 generalization links. Current: ${links.length}`);
        return links.length ? links[0].end : null;
    }

    private getConnections(type: 'association' | 'generalization') {
        return this.links[type].map((x: xmiAggregationLink) =>
            x.connector.source.typeRef === this ? x.connector.target : x.connector.source);
    }
}
