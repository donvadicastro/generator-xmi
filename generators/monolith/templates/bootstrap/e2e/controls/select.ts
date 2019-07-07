import {BaseControl} from "./base";
import {by} from "protractor";

export class SelectControl extends BaseControl {
    async setValue(value: string): Promise<void> {
        await this.element.element(by.cssContainingText('option', value)).click();
    }
}
