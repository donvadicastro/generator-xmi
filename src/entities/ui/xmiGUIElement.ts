import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiLink} from "../links/xmiLink";
import {xmiUMLDiagram} from "../diagrams/xmiUMLDiagram";
import {xmiPackage} from "../xmiPackage";

export class xmiGUIElement extends xmiBase {
    links: {informationFLow: xmiLink[]} = {informationFLow: []};
    properties: Map<string, string>;

    children: xmiGUIElement[] = [];

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
            ret[key].flow = this.links.informationFLow.map(x => `-> ${x.end && x.end.name}(${<xmiUMLDiagram>x.end && ((<xmiUMLDiagram>x.end).elementRef || {name: ''}).name})`);
        }

        return ret;
    }

}
