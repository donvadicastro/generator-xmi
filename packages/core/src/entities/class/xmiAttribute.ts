import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

import { strict as assert } from 'assert';

import {get} from "object-path";
import xmiBase from "../xmiBase";
import {TypeConverter} from "../../utils/typeConverter";
import {IAttribute} from "../../contracts/attribute";
import {xmiEnumeration} from "../xmiEnumeration";
import {xmiDataType} from "../xmiDataType";
import * as _ from "lodash";

export class xmiAttribute extends xmiBase implements IAttribute {
    typeRef?: xmiBase;
    typeDefaultValue = 'null';
    typeAllowedValues: any[] = [];
    isArray = false;
    isEnum = false;
    isDataType = false;

    constructor(raw: any, parent: xmiBase | null, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.name = this.name && _.camelCase(this.name);

        this.typeId = /*this.raw.$['xmi:idref'] || */
            get(raw, ['type', '0', '$', 'xmi:idref']) ||
            get(raw, ['type', '0', '$', 'href']) ||
            get(raw, ['properties', '0', '$', 'type']);

        assert(this.typeId, `Type should be specified for attribute "${this.name}" in class "${parent && parent.name}"`);

        this.isArray = TypeConverter.isArray(this.typeId);

        if(TypeConverter.isPrimitive(this.typeId)) {
            this.typeId = TypeConverter.convert(this.typeId);
            this.typeDefaultValue = this.isArray ? [] : TypeConverter.getTypeDefaultValue(this.type);
            this.typeAllowedValues = TypeConverter.getTypeAllowedValues(this.type);
        } else {
            this._factory.resolveById(this.typeId).subscribe(x => {
                this.typeRef = x;
                this.isEnum = (x instanceof xmiEnumeration);
                this.isDataType = (x instanceof xmiDataType);
            });
        }
    }

    get dbType(): string {
        return (<any>{string: 'varchar', number: 'float4', boolean: 'boolean', 'Date': 'timestamp'})[this.type];
    }
}
