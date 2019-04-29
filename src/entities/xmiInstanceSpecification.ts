import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiClass} from "./xmiClass";
import {Reference} from "../types/reference";

export class xmiInstanceSpecification extends xmiClass {
    get elementRef(): xmiClass {
        return <xmiClass>xmiComponentFactory.getByKey(this.raw.$.classifier);
    }

    get references(): Reference {
        const imports = super.references;

        //Inject base class when instance speciaification is used
        if (this.elementRef) {
            imports['../' + this.getRelativePath(this.elementRef) + '/components/' + this.elementRef.name] = this.elementRef.name;
        }

        return imports;
    }
}
