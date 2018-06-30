import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const camel = require('to-camel-case');

import {get} from "object-path";
import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";

export class xmiAttribute extends xmiBase {
    type: string;
    typeRef: xmiBase | null = null;

    constructor(raw: any, parent: xmiBase | null) {
        super(raw, parent);
        this.name = this.name && camel(this.name);

        this.type = /*this.raw.$['xmi:idref'] || */
            get(raw, ['type', '0', '$', 'xmi:idref']) ||
            get(raw, ['properties', '0', '$', 'type']);

        if(TypeConverter.isPrimititive(this.type)) {
            this.type = TypeConverter.convert(this.type);
        } else {
            xmiComponentFactory.getByKeyDeffered(this, 'typeRef', this.type);
        }
    }
}