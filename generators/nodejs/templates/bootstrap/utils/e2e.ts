import {browser, promise, protractor} from "protractor";

export function slowDownTestsExecution(timeoutMs: number) {
    const context = browser.driver.controlFlow();
    const origFn = browser.driver.controlFlow().execute;

    browser.driver.controlFlow().execute = function<T> (fn: () => (T | Promise<T>), opt_description?: string): Promise<T> {
        // @ts-ignore
        origFn.call(context, () => protractor.promise.delayed(timeoutMs));
        return <Promise<T>>origFn.call(context, fn);
    };
}
