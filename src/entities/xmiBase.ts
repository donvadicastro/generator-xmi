import {get} from 'object-path';
import {xmiPackage} from "./xmiPackage";
import {xmiComment} from "./xmiComment";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {Reference} from "../types/reference";
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
        const pathParts = this.path.slice(0, this.path.length - 1).reverse().map(x => x.name).filter(x => x);
        return pathParts.length ? pathParts.join('/') : '';
    }

    getPathFromRootWithModifier(modifier: (input: string) => string) {
        return this.pathFromRoot.split('/').map(x => modifier(x)).join('/');
    }

    getRelativePath(element: xmiBase) {
        return this.path.map(x => '..').join('/') + '/' +
            element.path.slice(0, element.path.length - 1).reverse().map(x => x.name).join('/');
    }

    getRelativeRoot() {
        return this.path.map(x => '..').join('/');
    }

    /**
     * Get all referenced entities for particular instance.
     */
    get references(): Reference {
        return {};
    }

    /**
     * Get all referenced entities for particular instance.
     */
    get referencesAsList(): {name: string, path: string}[] {
        const imports = this.references;

        return Object.keys(imports).sort((a, b) => imports[a] > imports[b] ? 1 : -1)
            .map(key => ({name: imports[key], path: key}));
    }

    constructor(raw: any, parent?: xmiPackage | xmiBase) {
        this.parent = parent;
        this.raw = raw;

        this.id = this.raw.$['xmi:id'] || this.raw.$['xmi:ifrefs']   || this.raw.$['xmi:idref'];
        this.type = this.raw.$['xmi:type'];
        this.nameOrigin = this.raw.$.name;
        this.name = this.nameOrigin && camel(this.nameOrigin);
        this.description = get(this.raw, ['properties', '0', '$', 'documentation']);
        this.alias = get(this.raw, ['properties', '0', '$', 'alias']);
        this.stereotype = get(this.raw, ['properties', '0', '$', 'stereotype']);

        this.comments = get(raw, 'ownedComment', []).map(x => <xmiComment>xmiComponentFactory.get(x));
    }

    refreshBase(raw: any, parent?: xmiPackage | xmiBase) {
        this.parent = this.parent || parent;
    }

    toConsole(): any | string {
        return `[${this.type}] ${this.name} (${this.id})`;
    }
}
