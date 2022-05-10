"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiUMLDiagram = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
class xmiUMLDiagram extends xmiBase_1.default {
    get elementRef() {
        const diagram = this._factory.getByKey(this._raw.extendedProperties[0].$.diagram);
        return diagram && diagram.elementRef;
    }
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
    }
}
exports.xmiUMLDiagram = xmiUMLDiagram;
//# sourceMappingURL=xmiUMLDiagram.js.map