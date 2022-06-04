import {BaseControl} from "./base";

export class CheckboxControl extends BaseControl {
    async setValue(value: string): Promise<void> {
        const checked = await this.element.isSelected();

        if((!checked && value === 'true') || (checked && value === 'false')) {
            await this.element.click();
        }
    }
}
