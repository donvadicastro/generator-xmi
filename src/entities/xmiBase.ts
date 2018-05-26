import {get} from 'object-path';
import {xmiPackage} from "./xmiPackage";
const camel = require('to-camel-case');

export default class xmiBase {
    parent: xmiPackage | xmiBase | null;
    raw: any;

    id: string;
    type: string;
    name: string;
    description: string;
    alias: string;
    stereotype: string;

    get path(): xmiBase[] {
        let path = [];
        let parent = this.parent;

        while (parent) {
            path.push(parent);
            parent = parent.parent;
        }

        return path;
    }

    constructor(raw: any, parent: xmiPackage | xmiBase | null) {
        this.parent = parent;
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
