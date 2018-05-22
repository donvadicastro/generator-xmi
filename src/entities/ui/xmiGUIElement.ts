import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiLink} from "../xmiLink";

export class xmiGUIElement extends xmiBase {
    links: {informationFLow: xmiLink[]} = {informationFLow: []};

    children: xmiGUIElement[] = [];

    constructor(raw: any) {
        super(raw);

        if(raw.links && raw.links.length && raw.links[0].InformationFlow) {
            this.links.informationFLow = raw.links[0].InformationFlow.map((x: any) => xmiComponentFactory.getLink(x));
        }

        this.parseChildren(raw);
    }

    parseChildren(raw: any) {
        this.children = (raw.nestedClassifier || [])
            .map((x: any) => xmiComponentFactory.get(x)).filter((x: any) => x);
    }

    toConsole() {
        const ret: any = super.toConsole();

        ret[this.name] = this.children.map(x => x.toConsole());
        return ret;
    }

}