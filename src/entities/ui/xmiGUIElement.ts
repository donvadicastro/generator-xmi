import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiLink} from "../links/xmiLink";
import {xmiUMLDiagram} from "../diagrams/xmiUMLDiagram";
import {xmiPackage} from "../xmiPackage";
import {Reference} from "../../types/reference";
import {xmiMessage} from "../collaboration/xmiMessage";
import {xmiCollaboration} from "../xmiCollaboration";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponent} from "../xmiComponent";
import {xmiDiagram} from "../diagrams/xmiDiagram";
const assert = require('assert');

export class xmiGUIElement extends xmiBase {
    links: {informationFLow: xmiLink[]} = {informationFLow: []};
    properties: Map<string, string>;

    children: xmiGUIElement[] = [];

    get references(): Reference {
        const imports = super.references;

        this.children.forEach((child, i) => {
            const elementRef = child.links.informationFLow.length && child.links.informationFLow[0].end &&
                <xmiCollaboration>(<xmiDiagram>child.links.informationFLow[0].end).elementRef;

            if(elementRef) {
                const elementRef = <xmiCollaboration>(<xmiDiagram>child.links.informationFLow[0].end).elementRef;
                imports[this.getRelativePath(elementRef) + '/process/' + elementRef.name] = elementRef.namePascal;

                elementRef.lifelines.forEach(lifeline => {
                    imports[this.getRelativePath(lifeline.elementRef) + '/components/' + lifeline.elementRef.name] = lifeline.elementRef.namePascal;
                });
        }});

        return imports;
    }

    constructor(raw: any, parent: xmiPackage) {
        super(raw, parent);

        if(raw.links && raw.links.length && raw.links[0].InformationFlow) {
            this.links.informationFLow = raw.links[0].InformationFlow.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        this.properties = new Map((raw.tags[0].tag || []).map((x: any) => [x.$.name, x.$.value]));
        this.properties.set('label', raw.$.name);

        this.parseChildren(raw);
    }

    parseChildren(raw: any) {
        this.children = (raw.nestedClassifier || [])
            .map((x: any) => xmiComponentFactory.get(x, this)).filter((x: any) => x);
    }

    toConsole() {
        const key: string = super.toConsole();
        const ret: any = {[key]: this.children.map(x => x.toConsole()) || []};


        if(this.links.informationFLow.length) {
            ret[key].flow = this.links.informationFLow.map(x => {
                if(x.start === this) {
                    assert(x.end && (<xmiDiagram>x.end).elementRef, `End for control "${this.name}" in diagram "${(<xmiBase>this.parent).path.map(x => x.name).join(' -> ')}" not specified`);
                }

                if(x.end === this) {
                    assert(x.start && (<xmiDiagram>x.start).elementRef, `Start for control "${this.name}" in diagram "${(<xmiBase>this.parent).path.map(x => x.name).join(' -> ')}" not specified`);
                }

                return `-> ${x.end && x.end.name}(${<xmiUMLDiagram>x.end && ((<xmiUMLDiagram>x.end).elementRef || {name: ''}).name})`;
            });
        }

        return ret;
    }

}
