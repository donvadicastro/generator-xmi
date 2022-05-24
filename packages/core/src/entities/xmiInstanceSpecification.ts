import {xmiAbstractClass} from "../base/xmiAbstractClass";
import {xmiClass} from "./xmiClass";
import xmiBase from "./xmiBase";
import {ArrayUtils} from "../utils/arrayUtils";

export class xmiInstanceSpecification extends xmiAbstractClass {
    get elementRef(): xmiClass {
        return <xmiClass>this._factory.getByKey(this._raw.$.classifier);
    }

    override get references(): xmiBase[] {
        const imports = super.references;

        //Inject base class when instance specification is used
        if (this.elementRef) {
            ArrayUtils.insertIfNotExists(this.elementRef, imports)
        }

        return imports;
    }
}
