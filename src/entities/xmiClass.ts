import {xmiInterface} from "./xmiInterface";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";
import {xmiAggregationLink} from "./links/xmiAggregationLink";
import {LinkType} from "../types/linkType";
import xmiBase from "./xmiBase";
import {IConnector} from "../contracts/connector";
import {IAttribute} from "../contracts/attribute";
import {Reference} from "../types/reference";

const assert = require('assert');

export class xmiClass extends xmiInterface {
    links: LinkType = {sequence: [], usage: [], aggregation: [], association: [], generalization: []};

    /**
     * Diagram fragments that class associate with.
     */
    fragments: xmiFragment[] = [];

    /**
     * Set of conditions that can be defined in diagram to particular operation.
     */
    conditions: {[operationName: string]: string[]} = {};

    constructor(raw: any, parent?: xmiPackage) {
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
    get aggregationLinks(): IConnector[] {
        return this.getConnections('aggregation');
    }

    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get associationLinks(): IConnector[] {
        return this.getConnections('association');
    }

    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get generalizationLinks(): IConnector[] {
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

    /**
     * Indicates that class has associated loop.
     */
    get hasLoop() {
        return this.fragments.find(x => x.interactionOperator === 'loop');
    }

    /**
     * Returns all entity attributes including added relation properties
     */
    get attributesCombined(): IAttribute[] {
        let attributes: IAttribute[] = [];

        attributes = attributes.concat(this.attributes);
        attributes = attributes.concat([...this.getConnections('aggregation'), ...this.getConnections('association')]
            .map(x => ((!x.target.multiplicity || x.target.multiplicity === '1' || x.target.multiplicity === '0..1') ? {
                name: (<xmiClass>x.target.typeRef).name + 'Ref',
                typeRef: x.target.typeRef,
                isArray: false
            } : {
                name: (<xmiClass>x.target.typeRef).name + 'RefList',
                typeRef: x.target.typeRef,
                isArray: true
            })));

        return attributes;
    }

    get references(): Reference {
        const imports = super.references;

        //Inject generalization references
        if(this.generalizationLinksTo) {
            imports['../' + this.getRelativePath(this.generalizationLinksTo) + '/components/generated/' + this.generalizationLinksTo.name + '.generated'] = this.generalizationLinksTo.namePascal + 'Base';
        }

        //Inject base interface when instance speciaification is used
        this.associationLinks.forEach(x => {
            const typeRef = <xmiClass>x.target.typeRef;
            imports['../' + this.getRelativePath(typeRef) + '/contracts/' + typeRef.name] = typeRef.namePascal  + 'Contract';
            imports['../' + this.getRelativePath(typeRef) + '/components/generated/' + typeRef.name + '.generated'] = typeRef.namePascal  + 'Base';
        });

        this.aggregationLinks.forEach(x => {
            const typeRef = <xmiClass>x.target.typeRef;
            imports['../' + this.getRelativePath(typeRef) + '/contracts/' + typeRef.name] = typeRef.namePascal + 'Contract';
            imports['../' + this.getRelativePath(typeRef) + '/components/generated/' + typeRef.name + '.generated'] = typeRef.namePascal + 'Base';
        });

        return imports;
    }

    toConsole(): any {
        const ret = super.toConsole();
        ret[Object.keys(ret)[0]].conditions = this.conditions;

        return ret;
    }

    private getConnections(type: 'association' | 'generalization' | 'aggregation'): IConnector[] {
        return this.links[type].map((x: xmiAggregationLink) => x.connector.getDirectedFrom(this));
    }
}
