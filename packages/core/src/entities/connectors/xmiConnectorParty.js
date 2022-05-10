"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_path_1 = require("object-path");
const xmiBase_1 = __importDefault(require("../xmiBase"));
class xmiConnectorParty extends xmiBase_1.default {
    constructor(raw, factory) {
        super(raw, null, factory);
        this.multiplicity = object_path_1.get(raw, 'type.0.$.multiplicity');
        this.aggregation = object_path_1.get(raw, 'type.0.$.aggregation', 'none');
        this._factory.resolveById(this.id).subscribe(x => {
            this.typeRef = x;
            this.initialized();
        });
    }
}
exports.default = xmiConnectorParty;
//# sourceMappingURL=xmiConnectorParty.js.map