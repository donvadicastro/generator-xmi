"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiAbstractClass = void 0;
const xmiInterface_1 = require("../entities/xmiInterface");
const xmiAggregationLink_1 = require("../entities/links/xmiAggregationLink");
const arrayUtils_1 = require("../utils/arrayUtils");
const assert = require('assert');
class xmiAbstractClass extends xmiInterface_1.xmiInterface {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.links = { sequence: [], usage: [], aggregation: [], association: [], generalization: [], realization: [] };
        /**
         * Diagram fragments that class associate with.
         */
        this.fragments = [];
        /**
         * Set of conditions that can be defined in diagram to particular operation.
         */
        this.conditions = {};
        if (raw.links && raw.links.length && raw.links[0].Aggregation) {
            this.links.aggregation = raw.links[0].Aggregation.map((x) => new xmiAggregationLink_1.xmiAggregationLink(x, this, factory));
        }
        if (raw.links && raw.links.length && raw.links[0].Association) {
            this.links.association = raw.links[0].Association.map((x) => new xmiAggregationLink_1.xmiAggregationLink(x, this, factory));
        }
        if (raw.links && raw.links.length && raw.links[0].Generalization) {
            this.links.generalization = raw.links[0].Generalization.map((x) => new xmiAggregationLink_1.xmiAggregationLink(x, this, factory));
        }
        if (raw.links && raw.links.length && raw.links[0].Realisation) {
            this.links.realization = raw.links[0].Realisation.map((x) => new xmiAggregationLink_1.xmiAggregationLink(x, this, factory));
        }
    }
    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get aggregationLinks() {
        return this.getConnections('aggregation');
    }
    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get associationLinks() {
        return this.getConnections('association');
    }
    /**
     * Two-way connections between elements, ignoring arrow direction
     */
    get generalizationLinks() {
        return this.getConnections('generalization');
    }
    /**
     * Realization one-way connection
     */
    get realizationLinks() {
        return this.getConnections('realization');
    }
    /**
     * Generalization links, when arrow to current element
     */
    get generalizationLinksFrom() {
        return this.links.generalization.filter(x => x.end === this).map(x => x.start);
    }
    /**
     * Generalization link, when arrow from current element
     */
    get generalizationLinksTo() {
        const links = this.generalization ?
            this.links.generalization.filter(x => x.start === this) : [];
        assert(links.length <= 1, `Class "${this.nameOrigin}" can have no more than 1 generalization links. Current: ${links.length}`);
        return links.length ? links[0].end : null;
    }
    /**
     * Generalization links, when arrow to current element
     */
    get implements() {
        return this.links.realization.filter(x => x.end === this).map(x => x.start);
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
    get attributesCombined() {
        let attributes = [];
        attributes = attributes.concat(this.attributes);
        attributes = attributes.concat([...this.getConnections('aggregation'), ...this.getConnections('association')]
            .map(x => ((!x.target.multiplicity || x.target.multiplicity === '1' || x.target.multiplicity === '0..1') ? {
            name: x.target.typeRef.name + 'Ref',
            typeRef: x.target.typeRef,
            isArray: false,
            isOptional: x.target.multiplicity === '0..1',
            //indicate if link to the parent in relation (composition, aggregation)
            isParent: x.source.typeRef === this && x.target.aggregation !== 'none',
            linkType: x[x.target.aggregation === 'none' ? 'source' : 'target'].aggregation,
            typeDefaultValue: 'null'
        } : {
            name: x.target.typeRef.name + 'RefList',
            typeRef: x.target.typeRef,
            isArray: true
        })));
        return attributes;
    }
    /**
     * Get all attributes that are used to edit entity content (main usage is form editing).
     */
    get attributesCombinedToEdit() {
        let attrs = this.attributesCombined;
        if (this.generalizationLinksTo) {
            attrs = attrs.concat(this.generalizationLinksTo.attributesCombinedToEdit);
        }
        return attrs.filter(x => x.name && !x.isParent);
    }
    get references() {
        const imports = super.references;
        //Inject generalization references
        if (this.generalizationLinksTo) {
            arrayUtils_1.ArrayUtils.insertIfNotExists(this.generalizationLinksTo, imports);
        }
        //Inject base interface when instance specification is used
        this.associationLinks.forEach(x => arrayUtils_1.ArrayUtils.insertIfNotExists(x.target.typeRef, imports));
        this.aggregationLinks.forEach(x => arrayUtils_1.ArrayUtils.insertIfNotExists(x.target.typeRef, imports));
        return imports;
    }
    toConsole() {
        const ret = super.toConsole();
        ret[Object.keys(ret)[0]].conditions = this.conditions;
        return ret;
    }
    getConnections(type) {
        return this.links[type].map((x) => x.connector.getDirectedFrom(this));
    }
}
exports.xmiAbstractClass = xmiAbstractClass;
//# sourceMappingURL=xmiAbstractClass.js.map