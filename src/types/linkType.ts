import {xmiLink} from "../entities/links/xmiLink";
import {xmiAggregationLink} from "../entities/links/xmiAggregationLink";

export type LinkType = {
    sequence: xmiLink[],
    usage: xmiLink[],

    aggregation: xmiAggregationLink[],
    association: xmiAggregationLink[],
    generalization: xmiAggregationLink[]
}
