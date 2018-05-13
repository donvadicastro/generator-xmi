import xmiBase from "../xmiBase";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiGUIElement extends xmiBase {
    children: xmiBase[] = [];

    constructor(raw: any) {
        super(raw);
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