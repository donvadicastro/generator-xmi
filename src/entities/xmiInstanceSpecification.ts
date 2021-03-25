import {Reference} from "../types/reference";
import {xmiAbstractClass} from "../base/xmiAbstractClass";
import {xmiClass} from "./xmiClass";

export class xmiInstanceSpecification extends xmiAbstractClass {
    get elementRef(): xmiClass {
        return <xmiClass>this._factory.getByKey(this._raw.$.classifier);
    }

    get references(): Reference {
        const imports = super.references;

        //Inject base class when instance speciaification is used
        if (this.elementRef) {
            imports['../' + this.getRelativePath(this.elementRef) + '/components/' + this.elementRef.name] = this.elementRef.namePascal;
        }

        return imports;
    }
}
