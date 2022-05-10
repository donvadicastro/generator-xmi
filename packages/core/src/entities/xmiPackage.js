"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiPackage = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
class xmiPackage extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.children = (raw.packagedElement || []).reverse()
            .map((x) => this._factory.get(x, this)).filter((x) => x).reverse();
    }
    getNode(path) {
        let node = this;
        path.split('.').forEach(x => {
            node = node && node.children.find((child) => child.name === x);
        });
        return node;
    }
    toConsole() {
        return { [super.toConsole()]: this.children.map(x => x.toConsole()) };
    }
}
exports.xmiPackage = xmiPackage;
//# sourceMappingURL=xmiPackage.js.map