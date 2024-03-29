import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const assert = require('assert');

export class xmiParameter extends xmiBase {
    typeRef: xmiBase | undefined = undefined;

    /**
     * Indicates parameter is an array.
     */
    isArray = false;

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this.typeId = raw.$.type;
        assert(this.typeId, `Type is not specified for parameter "${this.name}" in operation "${parent.name} -> ${parent.pathToRoot.map(x => x.name).join(' -> ')}"`);

        this.isArray = TypeConverter.isArray(this.typeId) || this.name.endsWith('List');

        if(TypeConverter.isPrimitive(this.typeId)) {
            this.typeId = TypeConverter.convert(this.typeId);
        } else {
            this._factory.resolveById(this.typeId).subscribe(x => this.typeRef = x);
        }
    }
}
