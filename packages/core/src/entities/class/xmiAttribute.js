"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiAttribute = void 0;
const camel = require('to-camel-case');
const assert = require('assert');
const object_path_1 = require("object-path");
const xmiBase_1 = __importDefault(require("../xmiBase"));
const typeConverter_1 = require("../../utils/typeConverter");
const xmiEnumeration_1 = require("../xmiEnumeration");
const xmiDataType_1 = require("../xmiDataType");
class xmiAttribute extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.typeDefaultValue = 'null';
        this.typeAllowedValues = [];
        this.isArray = false;
        this.isEnum = false;
        this.isDataType = false;
        this.name = this.name && camel(this.name);
        this.typeId = /*this.raw.$['xmi:idref'] || */
            object_path_1.get(raw, ['type', '0', '$', 'xmi:idref']) ||
                object_path_1.get(raw, ['type', '0', '$', 'href']) ||
                object_path_1.get(raw, ['properties', '0', '$', 'type']);
        assert(this.typeId, `Type should be specified for attribute "${this.name}" in class "${parent && parent.name}"`);
        this.isArray = typeConverter_1.TypeConverter.isArray(this.typeId);
        if (typeConverter_1.TypeConverter.isPrimitive(this.typeId)) {
            this.typeId = typeConverter_1.TypeConverter.convert(this.typeId);
            this.typeDefaultValue = this.isArray ? [] : typeConverter_1.TypeConverter.getTypeDefaultValue(this.type);
            this.typeAllowedValues = typeConverter_1.TypeConverter.getTypeAllowedValues(this.type);
        }
        else {
            this._factory.resolveById(this.typeId).subscribe(x => {
                this.typeRef = x;
                this.isEnum = (x instanceof xmiEnumeration_1.xmiEnumeration);
                this.isDataType = (x instanceof xmiDataType_1.xmiDataType);
            });
        }
    }
    get dbType() {
        return { string: 'varchar', number: 'float4', boolean: 'boolean', 'Date': 'timestamp' }[this.type];
    }
}
exports.xmiAttribute = xmiAttribute;
//# sourceMappingURL=xmiAttribute.js.map