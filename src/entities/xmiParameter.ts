import xmiBase from "./xmiBase";

export class xmiParameter extends xmiBase {
    type: string;

    constructor(raw: any) {
        super(raw);
        this.type = raw.$.type;
    }
}