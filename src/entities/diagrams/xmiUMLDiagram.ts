import {xmiDiagram} from './xmiDiagram';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import xmiBase from "../xmiBase";
import {xmiPackage} from "../xmiPackage";

export class xmiUMLDiagram extends xmiBase {
    get elementRef() {
        return (<xmiDiagram>xmiComponentFactory.getByKey(this.raw.extendedProperties[0].$.diagram))
            .elementRef;
    }

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);
    }
}