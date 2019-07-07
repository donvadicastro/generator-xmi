import {BaseControl} from "./base";

export class InputControl extends BaseControl {
    async setValue(value: string) {
        await this.element.clear();
        await this.element.sendKeys(value);
    }
}
