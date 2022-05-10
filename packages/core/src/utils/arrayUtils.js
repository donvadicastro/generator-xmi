"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtils = void 0;
class ArrayUtils {
    static insertIfNotExists(entity, array) {
        array.indexOf(entity) >= 0 || array.push(entity);
    }
}
exports.ArrayUtils = ArrayUtils;
//# sourceMappingURL=arrayUtils.js.map