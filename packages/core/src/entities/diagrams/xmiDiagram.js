"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiDiagram = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const xmiCollaboration_1 = require("../xmiCollaboration");
class xmiDiagram extends xmiBase_1.default {
    get elementRef() {
        return this._factory.getByKey(this._raw.model[0].$.owner)
            .children.find(x => x instanceof xmiCollaboration_1.xmiCollaboration);
    }
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.typeId = this._raw.properties[0].$.type;
        this.name = this._raw.properties[0].$.name;
    }
}
exports.xmiDiagram = xmiDiagram;
//# sourceMappingURL=xmiDiagram.js.map