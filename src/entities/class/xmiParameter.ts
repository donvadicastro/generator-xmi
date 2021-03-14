import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";
import {xmiInterface} from "../xmiInterface";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const assert = require('assert');

export class xmiParameter extends xmiBase {
    type: string;
    typeRef: xmiBase | undefined = undefined;
    typeDefaultValue = 'null';

    /**
     * Indicates parameter is an array.
     */
    isArray = false;

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this.type = raw.$.type;
        assert(this.type, `Type is not specified for parameter "${this.name}" in operation "${parent.name} -> ${parent.path.map(x => x.name).join(' -> ')}"`);

        this.isArray = TypeConverter.isArray(this.type) || this.name.endsWith('List');

        if(TypeConverter.isPrimititive(this.type)) {
            this.type = TypeConverter.convert(this.type);
            this.typeDefaultValue = this.isArray ? [] : TypeConverter.getTypeDefaultValue(this.type);
        } else {
            this._factory.resolveById(this.type).subscribe(x => this.typeRef = x);
        }
    }
}
