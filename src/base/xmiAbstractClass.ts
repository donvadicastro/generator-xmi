import {xmiInterface} from "../entities/xmiInterface";
import {xmiFragment} from "../entities/collaboration/xmiFragment";
import {xmiPackage} from "../entities/xmiPackage";
import {xmiAggregationLink} from "../entities/links/xmiAggregationLink";
import {LinkType} from "../types/linkType";
import xmiBase from "../entities/xmiBase";
import {IConnector} from "../contracts/connector";
import {IAttribute} from "../contracts/attribute";
import {Reference} from "../types/reference";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiClass} from "../entities/xmiClass";
import {ArrayUtils} from "../utils/arrayUtils";

const assert = require('assert');

export class xmiAbstractClass extends xmiInterface {
    links: LinkType = {sequence: [], usage: [], aggregation: [], association: [], generalization: [], realization: []};

    /**
     * Diagram fragments that class associate with.
     */
    fragments: xmiFragment[] = [];

    /**
     * Set of conditions that can be defined in diagram to particular operation.
     */
    conditions: {[operationName: string]: string[]} = {};

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        if(raw.links && raw.links.length && raw.links[0].Aggregation) {
            this.links.aggregation = raw.links[0].Aggregation.map((x: any) => new xmiAggregationLink(x, this, factory));
        }

        if(raw.links && raw.links.length && raw.links[0].Association) {
            this.links.association = raw.links[0].Association.map((x: any) => new xmiAggregationLink(x, this, factory));
        }

        if(raw.links && raw.links.length && raw.links[0].Generalization) {
            this.links.generalization = raw.links[0].Generalization.map((x: any) => new xmiAggregationLink(x, this, factory));
        }

        if(raw.links && raw.links.length && raw.links[0].Realisation) {
            this.links.realization = raw.links[0].Realisation.map((x: any) => new xmiAggregationLink(x, this, factory));
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
     * Realization one-way connection
     */
    get realizationLinks(): IConnector[] {
        return this.getConnections('realization');
    }

    /**
     * Generalization links, when arrow to current element
     */
    get generalizationLinksFrom(): xmiBase[] {
        return this.links.generalization.filter(x => x.end === this).map(x => <xmiBase>x.start);
    }

    /**
     * Generalization link, when arrow from current element
     */
    get generalizationLinksTo(): xmiBase | null {
        const links = this.generalization ?
            this.links.generalization.filter(x => x.start === this) : [];

        assert(links.length <= 1, `Class "${this.nameOrigin}" can have no more than 1 generalization links. Current: ${links.length}`);
        return links.length ? <xmiBase>links[0].end : null;
    }

    /**
     * Generalization links, when arrow to current element
     */
    get implements(): xmiBase[] {
        return this.links.realization.filter(x => x.end === this).map(x => <xmiBase>x.start);
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
                isArray: false,
                isOptional: x.target.multiplicity === '0..1',

                //indicate if link to the parent in relation (composition, aggregation)
                isParent: x.source.typeRef === this && x.target.aggregation !== 'none',
                linkType: x[x.target.aggregation === 'none' ? 'source' : 'target'].aggregation,

                typeDefaultValue: 'null'
            } : {
                name: (<xmiClass>x.target.typeRef).name + 'RefList',
                typeRef: x.target.typeRef,
                isArray: true
            })));

        return attributes;
    }

    /**
     * Get all attributes that are used to edit entity content (main usage is form editing).
     */
    get attributesCombinedToEdit(): IAttribute[] {
        let attrs = this.attributesCombined;

        if(this.generalizationLinksTo) {
            attrs = attrs.concat((<xmiAbstractClass>this.generalizationLinksTo).attributesCombinedToEdit);
        }

        return attrs.filter(x => x.name && !x.isParent);
    }

    get references(): xmiBase[] {
        const imports = super.references;

        //Inject generalization references
        if(this.generalizationLinksTo) {
            ArrayUtils.insertIfNotExists(this.generalizationLinksTo, imports)
        }

        //Inject base interface when instance specification is used
        this.associationLinks.forEach(x => ArrayUtils.insertIfNotExists(<xmiClass>x.target.typeRef, imports));
        this.aggregationLinks.forEach(x => ArrayUtils.insertIfNotExists(<xmiClass>x.target.typeRef, imports));

        return imports;
    }

    toConsole(): any {
        const ret = super.toConsole();
        ret[Object.keys(ret)[0]].conditions = this.conditions;

        return ret;
    }

    private getConnections(type: 'association' | 'generalization' | 'aggregation' | 'realization'): IConnector[] {
        return this.links[type].map((x: xmiAggregationLink) => x.connector.getDirectedFrom(this));
    }
}
