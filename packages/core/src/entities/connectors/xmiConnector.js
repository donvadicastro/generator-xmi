"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xmiConnectorParty_1 = __importDefault(require("./xmiConnectorParty"));
const object_path_1 = require("object-path");
const xmiBase_1 = __importDefault(require("../xmiBase"));
const rxjs_1 = require("rxjs");
class xmiConnector extends xmiBase_1.default {
    constructor(raw, factory) {
        super(raw, null, factory);
        this.condition = object_path_1.get(raw, 'extendedProperties.0.$.conditional');
        this.source = new xmiConnectorParty_1.default(raw.source[0], factory);
        this.target = new xmiConnectorParty_1.default(raw.target[0], factory);
        // change resolve state once all children resolved
        rxjs_1.forkJoin({
            source: this.source.onAfterInit,
            target: this.target.onAfterInit
        }).subscribe(() => this.initialized());
    }
    /**
     * Transform connector to be directed from defined connection party (consider as a source).
     * @param source
     */
    getDirectedFrom(source) {
        return this.source.typeRef === source ? this :
            { condition: this.condition, source: this.target, target: this.source };
    }
}
exports.default = xmiConnector;
//# sourceMappingURL=xmiConnector.js.map