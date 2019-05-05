import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiParameter extends xmiBase {
    type: string;
    typeRef: xmiBase | null = null;
    typeDefaultValue = 'null';

    /**
     * Indicates parameter is an array.
     */
    isArray = false;

    constructor(raw: any, parent: xmiBase) {
        super(raw, parent);
        this.type = raw.$.type;
        this.isArray = TypeConverter.isArray(this.type) || this.name.endsWith('List');

        if(TypeConverter.isPrimititive(this.type)) {
            this.type = TypeConverter.convert(this.type);
            this.typeDefaultValue = this.isArray ? [] : TypeConverter.getTypeDefaultValue(this.type);
        } else {
            xmiComponentFactory.getByKeyDeffered(this, 'typeRef', this.type);
        }
    }
}
