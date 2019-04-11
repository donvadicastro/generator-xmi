import {get} from 'object-path';
import {xmiPackage} from "./xmiPackage";
import {xmiComment} from "./xmiComment";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
const camel = require('to-camel-case');

export default class xmiBase {
    parent?: xmiPackage | xmiBase;
    raw: any;

    id: string;
    type: string;
    name: string;
    nameOrigin: string;
    description: string;
    alias: string;
    stereotype: string;

    comments: xmiComment[] = [];

    get path(): xmiBase[] {
        let path = [];
        let parent = this.parent;

        while (parent) {
            path.push(parent);
            parent = parent.parent;
        }

        return path;
    }

    get pathFromRoot() {
        return this.path.slice(0, this.path.length - 1).reverse().map(x => x.name).join('/');
    }

    getRelativePath(element: xmiBase) {
        return this.path.map(x => '..').join('/') + '/' +
            element.path.slice(0, element.path.length - 1).reverse().map(x => x.name).join('/');
    }

    getRelativeRoot() {
        return this.path.map(x => '..').join('/');
    }

    constructor(raw: any, parent?: xmiPackage | xmiBase) {
        this.parent = parent;
        this.raw = raw;

        this.id = this.raw.$['xmi:id'] || this.raw.$['xmi:ifrefs'];
        this.type = this.raw.$['xmi:type'];
        this.nameOrigin = this.raw.$.name;
        this.name = this.nameOrigin && camel(this.nameOrigin);
        this.description = get(this.raw, ['properties', '0', '$', 'documentation']);
        this.alias = get(this.raw, ['properties', '0', '$', 'alias']);
        this.stereotype = get(this.raw, ['properties', '0', '$', 'stereotype']);

        this.comments = get(raw, 'ownedComment', []).map(x => <xmiComment>xmiComponentFactory.get(x));
    }

    toConsole(): any | string {
        return `${this.name} (${this.id})`;
    }
}
