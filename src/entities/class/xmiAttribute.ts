import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const camel = require('to-camel-case');
const assert = require('assert');

import {get} from "object-path";
import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";
import {IAttribute} from "../../contracts/attribute";
import {xmiEnumeration} from "../xmiEnumeration";

export class xmiAttribute extends xmiBase implements IAttribute {
    type: string;
    typeRef?: xmiBase;
    typeDefaultValue = 'null';
    typeAllowedValues: any[] = [];
    isArray = false;
    isEnum = false;

    constructor(raw: any, parent?: xmiBase) {
        super(raw, parent);
        this.name = this.name && camel(this.name);

        this.type = /*this.raw.$['xmi:idref'] || */
            get(raw, ['type', '0', '$', 'xmi:idref']) ||
            get(raw, ['type', '0', '$', 'href']) ||
            get(raw, ['properties', '0', '$', 'type']);

        assert(this.type, `Type should be specified for attribute "${this.name}" in class "${parent && parent.name}"`);

        this.isArray = TypeConverter.isArray(this.type);

        if(TypeConverter.isPrimititive(this.type)) {
            this.type = TypeConverter.convert(this.type);
            this.typeDefaultValue = this.isArray ? [] : TypeConverter.getTypeDefaultValue(this.type);
            this.typeAllowedValues = TypeConverter.getTypeAllowedValues(this.type);
        } else {
            xmiComponentFactory.getByKeyDeffered(this, 'typeRef', this.type,
                (x) => this.isEnum = (x instanceof xmiEnumeration));
        }
    }

    get dbType(): string {
        return (<any>{string: 'varchar', number: 'float4', boolean: 'boolean', 'Date': 'timestamp'})[this.type];
    }
}
