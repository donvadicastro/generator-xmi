"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiDataType = void 0;
const xmiInterface_1 = require("./xmiInterface");
const arrayUtils_1 = require("../utils/arrayUtils");
class xmiDataType extends xmiInterface_1.xmiInterface {
    get references() {
        const imports = super.references;
        //Inject attributes type
        this.attributes.forEach(attribute => attribute.typeRef && arrayUtils_1.ArrayUtils.insertIfNotExists(attribute, imports));
        return imports;
    }
    /**
     * Get all attributes that are used to edit entity content (main usage is form editing).
     */
    get attributesCombinedToEdit() {
        return this.attributes;
    }
}
exports.xmiDataType = xmiDataType;
//# sourceMappingURL=xmiDataType.js.map