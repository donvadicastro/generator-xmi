"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiComponent = void 0;
const xmiRequired_1 = require("./component/xmiRequired");
const xmiAbstractClass_1 = require("../base/xmiAbstractClass");
const rxjs_1 = require("rxjs");
const arrayUtils_1 = require("../utils/arrayUtils");
class xmiComponent extends xmiAbstractClass_1.xmiAbstractClass {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.provided = [];
        this.required = [];
        this.connectors = [];
        this.refreshComponent(raw);
    }
    refreshComponent(raw, parent) {
        super.refresh(raw, parent);
        if (raw.links && raw.links.length && raw.links[0].Sequence) {
            this.links.sequence = raw.links[0].Sequence.map((x) => this._factory.getLink(x, this));
        }
        if (raw.links && raw.links.length && raw.links[0].Usage) {
            this.links.usage = raw.links[0].Usage.map((x) => this._factory.getLink(x, this));
        }
        if (raw.provided) {
            this.provided = raw.provided.map((x) => this._factory.registerProvide(x, this));
        }
        if (raw.required) {
            this.required = raw.required.map((x) => new xmiRequired_1.xmiRequired(x, this, this._factory));
        }
        if (raw.ownedConnector) {
            this.connectors = raw.ownedConnector.map((x) => this._factory.getConnectorByKey(x.$['xmi:id']));
            // connector source/target not yet fully initialized
            rxjs_1.forkJoin(this.connectors.map(x => x.onAfterInit)).subscribe(() => {
                this.connectors.forEach(x => {
                    const dep = this.createDependencyLinkByConnector(x, parent);
                    this.required.push(dep);
                    x.target.typeRef.provided.push(dep);
                });
            });
        }
    }
    get references() {
        const imports = super.references;
        this.provided.filter(x => x.typeRef).forEach(value => {
            const ref = value.typeRef;
            arrayUtils_1.ArrayUtils.insertIfNotExists(ref, imports);
            (ref.attributes || []).filter(x => x.typeRef).forEach(attribute => {
                const typeRef = attribute.typeRef;
                arrayUtils_1.ArrayUtils.insertIfNotExists(typeRef, imports);
            });
        });
        this.required.forEach(value => {
            const typeRef = value.typeRef;
            arrayUtils_1.ArrayUtils.insertIfNotExists(typeRef, imports);
        });
        return imports;
    }
    toConsole() {
        const ret = super.toConsole();
        const key = Object.keys(ret)[0];
        this.required && (ret[key].required = this.required.map(x => x.name));
        this.provided && (ret[key].provided = this.provided.map(x => x.name));
        this.connectors && (ret[key].connectors = this.connectors.map(x => x.id));
        return ret;
    }
    createDependencyLinkByConnector(connector, parent) {
        const typeRef = connector.target.typeRef;
        const identifiers = { $: { 'xmi:id': typeRef.id, 'xmi:idref': typeRef.id } };
        const dep = new xmiRequired_1.xmiRequired(identifiers, this, this._factory);
        //dep.typeRef = typeRef;
        //dep.linkRef = new xmiInOut(identifiers, parent || null, this._factory);
        return dep;
    }
}
exports.xmiComponent = xmiComponent;
//# sourceMappingURL=xmiComponent.js.map