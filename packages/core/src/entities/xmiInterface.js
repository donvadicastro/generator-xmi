"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiInterface = void 0;
const xmiBase_1 = __importDefault(require("./xmiBase"));
const xmiOperation_1 = require("./class/xmiOperation");
const object_path_1 = require("object-path");
const xmiGeneralization_1 = require("./connectors/xmiGeneralization");
const rxjs_1 = require("rxjs");
const arrayUtils_1 = require("../utils/arrayUtils");
class xmiInterface extends xmiBase_1.default {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.attributes = [];
        this.operations = [];
        this.refresh(raw, parent);
    }
    /**
     * Get all referenced entities for particular instance.
     */
    get references() {
        const imports = super.references;
        //Inject attributes type
        this.attributes.forEach(attribute => attribute.typeRef && arrayUtils_1.ArrayUtils.insertIfNotExists(attribute.typeRef, imports));
        //Inject operation parameters and return types
        this.operations.forEach(operation => {
            operation.returnParameter.typeRef &&
                arrayUtils_1.ArrayUtils.insertIfNotExists(operation.returnParameter.typeRef, imports);
            //Inject operation input parameter types
            operation.inputParameters
                .forEach(param => param.typeRef && arrayUtils_1.ArrayUtils.insertIfNotExists(param.typeRef, imports));
        });
        return imports;
    }
    refresh(raw, parent) {
        super.refreshBase(raw, parent);
        if (raw.ownedAttribute) {
            this.attributes = raw.ownedAttribute
                .map((x) => this._factory.get(x, this))
                .filter((x) => x.name);
        }
        else {
            this.attributes = object_path_1.get(raw, ['attributes', '0', 'attribute'], [])
                .map((x) => this._factory.get(x, this))
                .filter((x) => x.name);
        }
        if (raw.ownedOperation) {
            this.operations = raw.ownedOperation
                .map((x, i) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation_1.xmiOperation(x, this, this._factory));
        }
        else {
            this.operations = object_path_1.get(raw, ['operations', '0', 'operation'], [])
                .map((x, i) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation_1.xmiOperation(x, this, this._factory));
        }
        if (raw.generalization) {
            this.generalization = new xmiGeneralization_1.xmiGeneralization(object_path_1.get(raw, 'generalization.0'), this, this._factory);
        }
        this.attributes.sort((a, b) => a.name > b.name ? 1 : -1);
        this.operations.sort((a, b) => a.name > b.name ? 1 : -1);
        rxjs_1.forkJoin(this.attributes.map(x => x.onAfterInit))
            .subscribe(() => this.initialized());
        return this;
    }
    toConsole() {
        const key = super.toConsole();
        const ret = { [key]: {} };
        this.attributes.length && (ret[key].attributes = this.attributes.map(x => ({ [x.name]: (x.typeRef ? `${x.typeRef.name}(${x.typeId})` : x.typeId) })));
        this.operations.length && (ret[key].operations = this.operations
            .reduce((prev, x) => {
            const returnParameter = x.parameters.find(x => x.name === 'return');
            prev[`${x.name}(${x.parameters.filter(x => x.name !== 'return').map(x => x.name).join(',')})`] =
                returnParameter ? `${returnParameter.typeRef ? returnParameter.typeRef.name : returnParameter.type}${x.isReturnArray ? '[]' : ''}` : 'void';
            return prev;
        }, {}));
        return ret;
    }
}
exports.xmiInterface = xmiInterface;
//# sourceMappingURL=xmiInterface.js.map