import {BaseControl} from "./base";
import {by} from "protractor";

export class DropdownControl extends BaseControl {
    async setValue(value: string): Promise<void> {
        await this.element.click();
        await this.element.element(by.cssContainingText('.ui-dropdown-item span', value)).click();
    }
}
