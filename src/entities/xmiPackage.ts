import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiPackage extends xmiBase {
    children: xmiBase[];

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);

        this.children = (raw.packagedElement || []).reverse()
            .map((x: any) => xmiComponentFactory.get(x, this)).filter((x: any) => x).reverse();
    }

    toConsole() {
        return {[super.toConsole()]: this.children.map(x => x.toConsole())};
    }
}
