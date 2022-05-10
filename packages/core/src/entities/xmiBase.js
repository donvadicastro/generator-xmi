"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_path_1 = require("object-path");
const rxjs_1 = require("rxjs");
const typeConverter_1 = require("../utils/typeConverter");
const camel = require('to-camel-case');
const pascal = require('to-pascal-case');
/**
 * XMI primitive definition.
 *
 * Contains only basic fields that any XMI element should have.
 * If factory can't recognize nature of the element - base is created to track for possible usage.
 */
class xmiBase {
    constructor(raw, parent, factory) {
        this.comments = [];
        this.tags = {};
        /**
         * Trigger event when element is resolved
         * @param x resolved element
         */
        this.onAfterInit = new rxjs_1.ReplaySubject();
        this._factory = factory;
        this._raw = raw;
        this.parent = parent;
        this.id = this._raw.$['xmi:id'] || this._raw.$['xmi:ifrefs'] || this._raw.$['xmi:idref'];
        this.typeId = this._raw.$['xmi:type'];
        this.nameOrigin = this._raw.$.name;
        this.name = this.nameOrigin && camel(this.nameOrigin);
        this.namePascal = this.nameOrigin && pascal(this.nameOrigin);
        this.description = object_path_1.get(this._raw, ['properties', '0', '$', 'documentation']);
        this.alias = object_path_1.get(this._raw, ['properties', '0', '$', 'alias']);
        this.alias && (this.alias = this.alias.split('.').map(x => camel(x)).join('.'));
        this.stereotype = object_path_1.get(this._raw, ['properties', '0', '$', 'stereotype']);
        //parse comments
        this.comments = object_path_1.get(raw, 'ownedComment', []).map(x => this._factory.get(x));
        //parse tags
        this.tags = (raw.tags || []).reduce((prev, current) => {
            const tag = object_path_1.get(current, 'tag.0.$');
            tag && (prev[tag.name] = tag.value);
            return prev;
        }, {});
    }
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
    get className() {
        return this.constructor.name;
    }
    /**
     * Gets path from root to this element using file hierarchy path representation, e.g. "parent1/parent2/parent3"
     */
    get pathFromRoot() {
        return this.pathToRoot.slice(0, this.pathToRoot.length - 1).reverse();
    }
    /**
     * Gets list of parent elements up to root.
     */
    get pathToRoot() {
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
    getPathFromRoot(modifier = x => x, concat = '/') {
        return this.pathFromRoot.map(x => x.name).map(x => modifier(x)).join(concat);
    }
    /**
     * Gets stringified relative path to element, e.g. "../../parent1/parent2"
     * @param element element to build path to
     */
    getRelativePath(element) {
        return this.pathToRoot.map(x => '..').join('/') + '/' +
            element.pathToRoot.slice(0, element.pathToRoot.length - 1).reverse().map(x => x.name).join('/');
    }
    /**
     * Gets relative root path, e.g. "../../"
     */
    getRelativeRoot() {
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
        return typeConverter_1.TypeConverter.getType(this.typeId, this._factory.dialect);
    }
    /**
     * Gets all referenced entities for particular instance.
     */
    get references() {
        return [];
    }
    /**
     * Refresh element.
     * @param raw actual raw.
     * @param parent actual parent element.
     */
    refreshBase(raw, parent) {
        if (parent) {
            this.parent = this.parent || parent;
        }
    }
    /**
     * Gets console element view.
     */
    toConsole() {
        return `[${this.typeId}] ${this.name} (${this.id})`;
    }
}
exports.default = xmiBase;
//# sourceMappingURL=xmiBase.js.map