"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
function slowDownTestsExecution(timeoutMs) {
    const context = protractor_1.browser.driver.controlFlow();
    const origFn = protractor_1.browser.driver.controlFlow().execute;
    protractor_1.browser.driver.controlFlow().execute = function (fn, opt_description) {
        // @ts-ignore
        origFn.call(context, () => protractor_1.protractor.promise.delayed(timeoutMs));
        return origFn.call(context, fn);
    };
}
exports.slowDownTestsExecution = slowDownTestsExecution;
//# sourceMappingURL=e2e.js.map