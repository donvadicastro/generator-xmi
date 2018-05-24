import {get} from 'object-path';
const camel = require('to-camel-case');

export default class xmiBase {
    raw: any;

    id: string;
    type: string;
    name: string;
    description: string;
    alias: string;
    stereotype: string;

    constructor(raw: any) {
        this.raw = raw;

        this.id = this.raw.$['xmi:id'] || this.raw.$['xmi:ifrefs'];
        this.type = this.raw.$['xmi:type'];
        this.name = this.raw.$.name && camel(this.raw.$.name);
        this.description = get(this.raw, ['properties', '0', '$', 'documentation']);
        this.alias = get(this.raw, ['properties', '0', '$', 'alias']);
        this.stereotype = get(this.raw, ['properties', '0', '$', 'stereotype']);
    }

    toConsole(): any {
        return {
            [this.name]: this.id
        };
    }
}
