import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiPackage extends xmiBase {
    children: xmiBase[];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        this.children = (raw.packagedElement || []).reverse()
            .map((x: any) => xmiComponentFactory.get(x, this)).filter((x: any) => x).reverse();
    }

    toConsole() {
        const ret: any = super.toConsole();

        ret[this.name] = this.children.map(x => x.toConsole());
        return ret;
    }
}
