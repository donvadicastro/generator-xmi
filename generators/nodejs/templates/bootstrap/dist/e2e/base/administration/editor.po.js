"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
class EditorPageObject {
    get container() { return protractor_1.$('app-exchange-edit'); }
    get titleText() { return protractor_1.$('app-root h3').getText(); }
    get saveButton() { return protractor_1.$('button.btn-primary'); }
    get deleteButton() { return protractor_1.$('button.btn-danger'); }
}
exports.EditorPageObject = EditorPageObject;
//# sourceMappingURL=editor.po.js.map