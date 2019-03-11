import {xmiLink} from "../entities/links/xmiLink";
import {xmiAggregationLink} from "../entities/links/xmiAggregationLink";
import {xmiAssociation} from "../entities/connectors/xmiAssociation";

export type LinkType = {
    sequence: xmiLink[],
    usage: xmiLink[],

    aggregation: xmiAggregationLink[],
    association: xmiAggregationLink[]
}