"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorPageObject = void 0;
const protractor_1 = require("protractor");
class EditorPageObject {
    get container() { return (0, protractor_1.$)('app-exchange-edit'); }
    get titleText() { return (0, protractor_1.$)('app-root h3').getText(); }
    get saveButton() { return (0, protractor_1.$)('button.btn-primary'); }
    get deleteButton() { return (0, protractor_1.$)('button.btn-danger'); }
}
exports.EditorPageObject = EditorPageObject;
//# sourceMappingURL=editor.po.js.map