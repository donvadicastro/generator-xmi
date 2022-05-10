"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiParameter = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const typeConverter_1 = require("../../utils/typeConverter");
const assert = require('assert');
class xmiParameter extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.typeRef = undefined;
        this.typeDefaultValue = 'null';
        /**
         * Indicates parameter is an array.
         */
        this.isArray = false;
        this.typeId = raw.$.type;
        assert(this.typeId, `Type is not specified for parameter "${this.name}" in operation "${parent.name} -> ${parent.pathToRoot.map(x => x.name).join(' -> ')}"`);
        this.isArray = typeConverter_1.TypeConverter.isArray(this.typeId) || this.name.endsWith('List');
        if (typeConverter_1.TypeConverter.isPrimitive(this.typeId)) {
            this.typeId = typeConverter_1.TypeConverter.convert(this.typeId);
            this.typeDefaultValue = this.isArray ? [] : typeConverter_1.TypeConverter.getTypeDefaultValue(this.type);
        }
        else {
            this._factory.resolveById(this.typeId).subscribe(x => this.typeRef = x);
        }
    }
}
exports.xmiParameter = xmiParameter;
//# sourceMappingURL=xmiParameter.js.map