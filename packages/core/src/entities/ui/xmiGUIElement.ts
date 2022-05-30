import xmiBase from "../xmiBase";
import {xmiLink} from "../links/xmiLink";
import {xmiUMLDiagram} from "../diagrams/xmiUMLDiagram";
import {xmiPackage} from "../xmiPackage";
import {xmiCollaboration} from "../xmiCollaboration";
import {xmiDiagram} from "../diagrams/xmiDiagram";
import {xmiClass} from "../xmiClass";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {ArrayUtils} from "../../utils/arrayUtils";

const assert = require('assert');

export class xmiGUIElement extends xmiBase {
    links: {informationFLow: xmiLink[]} = {informationFLow: []};
    properties: Map<string, string>;
    typeRef?: xmiClass;

    children: xmiGUIElement[] = [];

    override get references(): xmiBase[] {
        const imports = super.references;

        this.children.forEach((child) => {
            const elementRef = child.links.informationFLow.length && child.links.informationFLow[0].end &&
                <xmiCollaboration>(<xmiDiagram>child.links.informationFLow[0].end).elementRef;

            if(elementRef) {
                ArrayUtils.insertIfNotExists(elementRef, imports)
                elementRef.lifelines.forEach(lifeline => ArrayUtils.insertIfNotExists(lifeline.elementRef, imports));
            }});

        return imports;
    }

    getInformationFlows(direction: 'in' | 'out') {
        return this.links.informationFLow
            .filter(x => (direction === 'in' ? x.end : x.start) === this)
            .filter(x => (direction === 'in' ? x.start : x.end) instanceof xmiUMLDiagram);
    }

    getCascadeFlows(direction: 'in' | 'out') {
        return this.links.informationFLow
            .filter(x => (direction === 'in' ? x.end : x.start) === this)
            .filter(x => (direction === 'in' ? x.start : x.end) instanceof xmiGUIElement);
    }

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        if(raw.links && raw.links.length && raw.links[0].InformationFlow) {
            this.links.informationFLow = raw.links[0].InformationFlow.map((x: any) => this._factory.getLink(x, this));
        }

        this.properties = new Map((raw.tags[0].tag || []).map((x: any) => [x.$.name, x.$.value]));
        this.properties.set('label', raw.$.name);

        if(this._raw.$['classifier']) {
            this._factory.resolveById(this._raw.$['classifier']).subscribe(x => this.typeRef = <xmiClass>x);
        }

        this.parseChildren(raw);
    }

    parseChildren(raw: any) {
        this.children = (raw.nestedClassifier || [])
            .map((x: any) => this._factory.get(x, this)).filter((x: any) => x);

        assert(this.children.map(x => x.name)
            .every((x: string, index: number, arr: string[]) => arr.indexOf(x) === index),
            `Control names on the "${this.name}" UI form should be unique: "${this.children.map(x => x.name)}"`);
    }

    override toConsole() {
        const key: string = super.toConsole();
        const ret: any = {[key]: this.children.map(x => x.toConsole()) || []};


        if(this.links.informationFLow.length) {
            ret[key].flowIn = this.getInformationFlows('in').map(x => {
                assert(x.start && (<xmiDiagram>x.start).elementRef, `Start for control "${this.name}" in diagram "${(<xmiBase>this.parent).pathToRoot.map(x => x.name).join(' -> ')}" not specified`);
                return `-> ${x.start && x.start.name}(${<xmiUMLDiagram>x.end && ((<xmiUMLDiagram>x.end).elementRef || {name: ''}).name})`;
            });

            ret[key].flowOut = this.getInformationFlows('out').map(x => {
                assert(x.end && (<xmiDiagram>x.end).elementRef, `End for control "${this.name}" in diagram "${(<xmiBase>this.parent).pathToRoot.map(x => x.name).join(' -> ')}" not specified`);
                return `-> ${x.end && x.end.name}(${<xmiUMLDiagram>x.end && ((<xmiUMLDiagram>x.end).elementRef || {name: ''}).name})`;
            });
        }

        return ret;
    }

}
