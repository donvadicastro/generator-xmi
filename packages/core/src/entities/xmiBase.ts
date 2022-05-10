import {get} from 'object-path';
import {xmiPackage} from "./xmiPackage";
import {xmiComment} from "./xmiComment";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {ReplaySubject} from "rxjs";
import {TypeConverter} from "../utils/typeConverter";

const camel = require('to-camel-case');
const pascal = require('to-pascal-case');

/**
 * XMI primitive definition.
 *
 * Contains only basic fields that any XMI element should have.
 * If factory can't recognize nature of the element - base is created to track for possible usage.
 */
export default class xmiBase {
    protected readonly _raw: any;
    protected readonly _factory: xmiComponentFactory;

    /**
     * Element parent. Null if root or parent is not supported for this type.
     */
    parent: xmiPackage | xmiBase | null;

    /**
     * Element form unique identifier.
     */
    id: string;

    /**
     * Element type identifier.
     * Is used for further casting to project-specific type, e.g. string in JS and String in JAVA.
     */
    typeId: string;

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

    /**
     * Gets instantiated element class name.
     */
    get className(): string {
        return this.constructor.name;
    }

    /**
     * Gets path from root to this element using file hierarchy path representation, e.g. "parent1/parent2/parent3"
     */
    private get pathFromRoot(): xmiBase[] {
        return this.pathToRoot.slice(0, this.pathToRoot.length - 1).reverse();
    }

    /**
     * Gets list of parent elements up to root.
     */
    get pathToRoot(): xmiBase[] {
        let path = [];
        let parent = this.parent;

        while (parent) {
            path.push(parent);
            parent = parent.parent;
        }

        return path;
    }

    /**
     * Gets stringified path from root to current element.
     * @param modifier name modifier function (takes names as inout and produce changed name as output).
     *  Returns same input by default.
     * @param concat concatenator, default "/"
     */
    getPathFromRoot(modifier: (input: string) => string = x => x, concat = '/'): string {
        return this.pathFromRoot.map(x => x.name).map(x => modifier(x)).join(concat);
    }

    /**
     * Gets stringified relative path to element, e.g. "../../parent1/parent2"
     * @param element element to build path to
     */
    getRelativePath(element: xmiBase): string {
        return this.pathToRoot.map(x => '..').join('/') + '/' +
            element.pathToRoot.slice(0, element.pathToRoot.length - 1).reverse().map(x => x.name).join('/');
    }

    /**
     * Gets relative root path, e.g. "../../"
     */
    getRelativeRoot(): string {
        return this.pathToRoot.map(x => '..').join('/');
    }

    /**
     * Gets element user friendly unique identifier.
     */
    get elementId() {
        return `${this.getPathFromRoot(input => input, '_')}_${this.name}`;
    }

    /**
     * Gets actual type (using language qualifier).
     */
    get type() {
        return TypeConverter.getType(this.typeId, this._factory.dialect);
    }

    /**
     * Gets all referenced entities for particular instance.
     */
    get references(): xmiBase[] {
        return [];
    }

    constructor(raw: any, parent: xmiPackage | xmiBase | null, factory: xmiComponentFactory) {
        this._factory = factory;
        this._raw = raw;

        this.parent = parent;

        this.id = this._raw.$['xmi:id'] || this._raw.$['xmi:ifrefs'] || this._raw.$['xmi:idref'];
        this.typeId = this._raw.$['xmi:type'];

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

    /**
     * Refresh element.
     * @param raw actual raw.
     * @param parent actual parent element.
     */
    refreshBase(raw: any, parent?: xmiPackage | xmiBase) {
        if(parent) {
            this.parent = this.parent || parent;
        }
    }

    /**
     * Gets console element view.
     */
    toConsole(): any | string {
        return `[${this.typeId}] ${this.name} (${this.id})`;
    }
}
