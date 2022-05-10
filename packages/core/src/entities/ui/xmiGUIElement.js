"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiGUIElement = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const xmiUMLDiagram_1 = require("../diagrams/xmiUMLDiagram");
const arrayUtils_1 = require("../../utils/arrayUtils");
const assert = require('assert');
class xmiGUIElement extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.links = { informationFLow: [] };
        this.children = [];
        if (raw.links && raw.links.length && raw.links[0].InformationFlow) {
            this.links.informationFLow = raw.links[0].InformationFlow.map((x) => this._factory.getLink(x, this));
        }
        this.properties = new Map((raw.tags[0].tag || []).map((x) => [x.$.name, x.$.value]));
        this.properties.set('label', raw.$.name);
        if (this._raw.$['classifier']) {
            this._factory.resolveById(this._raw.$['classifier']).subscribe(x => this.typeRef = x);
        }
        this.parseChildren(raw);
    }
    get references() {
        const imports = super.references;
        this.children.forEach((child, i) => {
            const elementRef = child.links.informationFLow.length && child.links.informationFLow[0].end &&
                child.links.informationFLow[0].end.elementRef;
            if (elementRef) {
                arrayUtils_1.ArrayUtils.insertIfNotExists(elementRef, imports);
                elementRef.lifelines.forEach(lifeline => arrayUtils_1.ArrayUtils.insertIfNotExists(lifeline.elementRef, imports));
            }
        });
        return imports;
    }
    getInformationFlows(direction) {
        return this.links.informationFLow
            .filter(x => (direction === 'in' ? x.end : x.start) === this)
            .filter(x => (direction === 'in' ? x.start : x.end) instanceof xmiUMLDiagram_1.xmiUMLDiagram);
    }
    getCascadeFlows(direction) {
        return this.links.informationFLow
            .filter(x => (direction === 'in' ? x.end : x.start) === this)
            .filter(x => (direction === 'in' ? x.start : x.end) instanceof xmiGUIElement);
    }
    parseChildren(raw) {
        this.children = (raw.nestedClassifier || [])
            .map((x) => this._factory.get(x, this)).filter((x) => x);
        assert(this.children.map(x => x.name)
            .every((x, index, arr) => arr.indexOf(x) === index), `Control names on the "${this.name}" UI form should be unique: "${this.children.map(x => x.name)}"`);
    }
    toConsole() {
        const key = super.toConsole();
        const ret = { [key]: this.children.map(x => x.toConsole()) || [] };
        if (this.links.informationFLow.length) {
            ret[key].flowIn = this.getInformationFlows('in').map(x => {
                assert(x.start && x.start.elementRef, `Start for control "${this.name}" in diagram "${this.parent.pathToRoot.map(x => x.name).join(' -> ')}" not specified`);
                return `-> ${x.start && x.start.name}(${x.end && (x.end.elementRef || { name: '' }).name})`;
            });
            ret[key].flowOut = this.getInformationFlows('out').map(x => {
                assert(x.end && x.end.elementRef, `End for control "${this.name}" in diagram "${this.parent.pathToRoot.map(x => x.name).join(' -> ')}" not specified`);
                return `-> ${x.end && x.end.name}(${x.end && (x.end.elementRef || { name: '' }).name})`;
            });
        }
        return ret;
    }
}
exports.xmiGUIElement = xmiGUIElement;
//# sourceMappingURL=xmiGUIElement.js.map