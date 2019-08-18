import xmiBase from "./xmiBase";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiPackage extends xmiBase {
    children: xmiBase[];

    getNode(path: string): xmiBase {
        let node: any = this;

        path.split('.').forEach(x => {
            node = node && node.children.find((child: xmiBase) => child.name === x);
        });

        return node;
    }

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);

        this.children = (raw.packagedElement || []).reverse()
            .map((x: any) => xmiComponentFactory.get(x, this)).filter((x: any) => x).reverse();
    }

    toConsole() {
        return {[super.toConsole()]: this.children.map(x => x.toConsole())};
    }
}
