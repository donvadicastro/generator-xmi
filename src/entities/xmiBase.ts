import {get} from 'object-path';

export default class xmiBase {
    raw: any;

    id: string;
    type: string;
    name: string;
    description: string;

    constructor(raw: any) {
        this.raw = raw;

        this.id = this.raw.$['xmi:id'];
        this.type = this.raw.$['xmi:type'];
        this.name = this.raw.$.name;
        this.description = get(this.raw, ['properties', '0', '$', 'documentation']);
    }

    toConsole(): any {
        return {
            [this.name]: this.id
        };
    }
}
