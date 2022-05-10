"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiCollaboration = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
const object_path_1 = require("object-path");
const xmiAttribute_1 = require("./class/xmiAttribute");
const rxjs_1 = require("rxjs");
const arrayUtils_1 = require("../utils/arrayUtils");
const assert = require('assert');
class xmiCollaboration extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.fragments = [];
        this.messages = [];
        this.attributes = (this._raw.ownedAttribute || [])
            .map((x) => new xmiAttribute_1.xmiAttribute(x, this, factory));
        this.lifelines = object_path_1.get(this._raw, 'ownedBehavior.0.lifeline', [])
            .map((x) => this._factory.get(x, this, this.attributes));
        this.fragments = object_path_1.get(this._raw, 'ownedBehavior.0.fragment', [])
            .map((x) => this._factory.get(x, this, this.lifelines));
        this.messages = object_path_1.get(this._raw, 'ownedBehavior.0.message', [])
            .map((x) => {
            const message = this._factory.get(x, this, this.fragments);
            rxjs_1.forkJoin({
                from: message.from ? message.from.onAfterInit : rxjs_1.of(),
                to: message.to ? message.to.onAfterInit : rxjs_1.of()
            }).subscribe(() => {
                //when lifeline is not presenter in XMI, but message use
                if (message.from && !this.lifelines.find(x => x.elementRef === message.from.elementRef)) {
                    const lifeline = this._factory.lifelineHash.find(x => x.elementRef === message.from.elementRef);
                    assert(lifeline, `Lifeline for FROM (${message.from.elementRef.name}) object not exists: ${this.pathToRoot.map(x => x.name).join(' -> ')}`);
                    this.lifelines.push(lifeline);
                }
                //when lifeline is not presenter in XMI, but message use
                if (message.to && !this.lifelines.find(x => (x || {}).elementRef === message.to.elementRef)) {
                    const lifeline = this._factory.lifelineHash.find(x => x.elementRef === message.to.elementRef);
                    assert(lifeline, `Lifeline for TO(${message.to.elementRef.name}) object not exists: ${this.pathToRoot.map(x => x.name).join(' -> ')}`);
                    this.lifelines.push(lifeline);
                }
            });
            return message;
        });
    }
    initialize() {
    }
    get loopFragments() {
        return this.fragments.filter(x => x.type === 'uml:CombinedFragment' && x.interactionOperator === 'loop');
    }
    get conditionFragments() {
        return this.fragments.filter(x => x.type === 'uml:CombinedFragment' && x.interactionOperator === 'alt');
    }
    get references() {
        const imports = super.references;
        this.lifelines.forEach((lifeline, index) => arrayUtils_1.ArrayUtils.insertIfNotExists(lifeline.elementRef, imports));
        return imports;
    }
    toConsole() {
        return {
            lifelines: this.lifelines.map(x => x.toConsole()),
            fragments: this.fragments.filter(x => x.name).map(x => x.toConsole()),
            messages: this.messages.map(x => x.toConsole())
        };
    }
}
exports.xmiCollaboration = xmiCollaboration;
//# sourceMappingURL=xmiCollaboration.js.map