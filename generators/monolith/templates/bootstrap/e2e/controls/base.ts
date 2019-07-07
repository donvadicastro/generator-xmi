import {ElementArrayFinder, ElementFinder, ProtractorBrowser} from "protractor";

export abstract class BaseControl  {
    constructor(protected element: ElementFinder) {}

    public abstract async setValue(value: string): Promise<void>;
}
