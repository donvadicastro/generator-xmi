"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectControl = void 0;
const base_1 = require("./base");
const protractor_1 = require("protractor");
class SelectControl extends base_1.BaseControl {
    setValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.element.element(protractor_1.by.cssContainingText('option', value)).click();
        });
    }
}
exports.SelectControl = SelectControl;
//# sourceMappingURL=select.js.map