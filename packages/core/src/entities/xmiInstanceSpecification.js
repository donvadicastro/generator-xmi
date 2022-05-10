"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiInstanceSpecification = void 0;
const xmiAbstractClass_1 = require("../base/xmiAbstractClass");
const arrayUtils_1 = require("../utils/arrayUtils");
class xmiInstanceSpecification extends xmiAbstractClass_1.xmiAbstractClass {
    get elementRef() {
        return this._factory.getByKey(this._raw.$.classifier);
    }
    get references() {
        const imports = super.references;
        //Inject base class when instance specification is used
        if (this.elementRef) {
            arrayUtils_1.ArrayUtils.insertIfNotExists(this.elementRef, imports);
        }
        return imports;
    }
}
exports.xmiInstanceSpecification = xmiInstanceSpecification;
//# sourceMappingURL=xmiInstanceSpecification.js.map