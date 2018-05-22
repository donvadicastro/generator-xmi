import {xmiDiagram} from './xmiDiagram';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiUMLDiagram extends xmiDiagram {
    get elementRef() {
        return (<xmiDiagram>xmiComponentFactory.getByKey(this.raw.extendedProperties[0].$.diagram))
            .elementRef;
    }

    constructor(raw: any) {
        super(raw);
    }
}