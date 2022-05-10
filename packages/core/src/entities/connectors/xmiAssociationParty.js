"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiAssociationParty = void 0;
const object_path_1 = require("object-path");
const xmiBase_1 = __importDefault(require("../xmiBase"));
class xmiAssociationParty extends xmiBase_1.default {
    constructor(raw, factory) {
        super(raw, null, factory);
        this.typeRef = undefined;
        this.value = { lower: this.getValue(object_path_1.get(raw, 'lowerValue.0.$')), upper: this.getValue(object_path_1.get(raw, 'upperValue.0.$')) };
        this.aggregation = raw.$['aggregation'];
        this._factory.resolveById(object_path_1.get(raw, 'type.0.$.xmi:idref')).subscribe(x => this.typeRef = x);
    }
    getValue(value) {
        switch ((value || {}).type) {
            case 'uml:LiteralInteger':
                value = parseInt(value.value);
                break;
            case 'uml:LiteralUnlimitedNatural':
                value = '*';
                break;
            default: break;
        }
        return value;
    }
}
exports.xmiAssociationParty = xmiAssociationParty;
//# sourceMappingURL=xmiAssociationParty.js.map