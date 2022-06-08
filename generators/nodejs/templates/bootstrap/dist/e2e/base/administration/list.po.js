"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
class ListPageObject {
    get title() { return protractor_1.$('app-root h3'); }
    get titleText() { return this.title.getText(); }
    get addNewButton() { return protractor_1.$('app-root .btn-primary'); }
    get list() { return protractor_1.$('.ui-table-wrapper table'); }
    get listHeaders() { return protractor_1.$$('.ui-table-wrapper table thead tr th').getText(); }
    get listRawData() { return protractor_1.$$('.ui-table-wrapper table tbody tr').map(x => x.$$('td').getText()); }
    get listData() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.listHeaders;
            const actual = (yield this.listRawData).map((x) => x.reduce((prev, y, i) => {
                prev[headers[i]] = y;
                return prev;
            }, {}));
            return actual;
        }))();
    }
    getPresenceOf(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const actual = yield this.listData;
            const keys = Object.keys(item);
            return actual.find(x => keys.reduce((res, y) => {
                if (x[y] !== item[y]) {
                    res = false;
                }
                return res;
            }, true)) !== undefined;
        });
    }
    openEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cell = this.list.$(`td a[ng-reflect-router-link="${id}"]`);
            yield protractor_1.browser.wait(cell.isDisplayed(), 1000);
            yield cell.click();
        });
    }
    navigateTo(page) {
        return protractor_1.browser.get(protractor_1.browser.baseUrl + this.baseUrl + (page || ''));
    }
}
exports.ListPageObject = ListPageObject;
//# sourceMappingURL=list.po.js.map