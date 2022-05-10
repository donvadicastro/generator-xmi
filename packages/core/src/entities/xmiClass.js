"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiClass = void 0;
const xmiAbstractClass_1 = require("../base/xmiAbstractClass");
class xmiClass extends xmiAbstractClass_1.xmiAbstractClass {
    toConsole() {
        if (!this.attributes.find(x => x.name === 'name') && !this.tags.displayName) {
            this._factory.logError(`Class "${this.name} (${this.id}) -> ${this.pathToRoot.map(x => x.name).join(' -> ')}" should contains "name" attribute or defined "displayName" tag instead`);
        }
        return super.toConsole();
    }
}
exports.xmiClass = xmiClass;
//# sourceMappingURL=xmiClass.js.map