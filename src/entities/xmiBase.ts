import {get} from 'object-path';
import {xmiPackage} from "./xmiPackage";
import {xmiComment} from "./xmiComment";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {Reference} from "../types/reference";
import {ReplaySubject} from "rxjs";

const camel = require('to-camel-case');
const pascal = require('to-pascal-case');

export default class xmiBase {
    protected readonly _raw: any;
    protected readonly _factory: xmiComponentFactory;

    parent: xmiPackage | xmiBase | null;

    id: string;
    type: string;
    name: string;
    nameOrigin: string;
    namePascal: string;
    description: string;
    alias: string;
    stereotype: string;

    comments: xmiComment[] = [];
    tags: {[key: string]: string} = {};

    /**
     * Trigger event when element is resolved
     * @param x resolved element
     */
    onAfterInit = new ReplaySubject<xmiBase>();

    /**
     * Notify element fully initialized.
     */
    initialized() {
        this.onAfterInit.next(this);
        this.onAfterInit.complete();
    }

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

    getPathFromRootWithModifier(modifier: (input: string) => string, concat = '/') {
        return this.pathFromRoot.split('/').map(x => modifier(x)).join(concat);
    }

    getRelativePath(element: xmiBase) {
        return this.path.map(x => '..').join('/') + '/' +
            element.path.slice(0, element.path.length - 1).reverse().map(x => x.name).join('/');
    }

    getRelativeRoot() {
        return this.path.map(x => '..').join('/');
    }

    get elementId() {
        return `${this.getPathFromRootWithModifier(input => input, '_')}_${this.name}`;
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

    constructor(raw: any, parent: xmiPackage | xmiBase | null, factory: xmiComponentFactory) {
        this._factory = factory;
        this.parent = parent;
        this._raw = raw;

        this.id = this._raw.$['xmi:id'] || this._raw.$['xmi:ifrefs'] || this._raw.$['xmi:idref'];
        this.type = this._raw.$['xmi:type'];
        this.nameOrigin = this._raw.$.name;
        this.name = this.nameOrigin && camel(this.nameOrigin);
        this.namePascal = this.nameOrigin && pascal(this.nameOrigin);
        this.description = get(this._raw, ['properties', '0', '$', 'documentation']);

        this.alias = get(this._raw, ['properties', '0', '$', 'alias']);
        this.alias && (this.alias = this.alias.split('.').map(x => camel(x)).join('.'));

        this.stereotype = get(this._raw, ['properties', '0', '$', 'stereotype']);

        //parse comments
        this.comments = get(raw, 'ownedComment', []).map(x => <xmiComment>this._factory.get(x));

        //parse tags
        this.tags = (raw.tags || []).reduce((prev: any, current: any) => {
            const tag: {name: string, value: string} = get(current, 'tag.0.$');
            tag && (prev[tag.name] = tag.value);
            return prev;
        }, {});
    }

    refreshBase(raw: any, parent?: xmiPackage | xmiBase) {
        if(parent) {
            this.parent = this.parent || parent;
        }
    }

    toConsole(): any | string {
        return `[${this.type}] ${this.name} (${this.id})`;
    }
}
