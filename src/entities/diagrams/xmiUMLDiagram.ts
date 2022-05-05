import {xmiDiagram} from './xmiDiagram';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import xmiBase from "../xmiBase";
import {xmiPackage} from "../xmiPackage";

export class xmiUMLDiagram extends xmiBase {
    get elementRef() {
        const diagram = <xmiDiagram>this._factory.getByKey(this._raw.extendedProperties[0].$.diagram);
        return diagram && diagram.elementRef;
    }

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);
    }
}
