import xmiBase from "./xmiBase";
import {xmiOperation} from "./class/xmiOperation";
import {get} from "object-path";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiGeneralization} from "./connectors/xmiGeneralization";
import {Reference} from "../types/reference";
import {forkJoin} from "rxjs";
import {ArrayUtils} from "../utils/arrayUtils";

export class xmiInterface extends xmiBase {
    attributes: xmiAttribute[] = [];
    operations: xmiOperation[] = [];
    generalization?: xmiGeneralization;

    /**
     * Get all referenced entities for particular instance.
     */
    get references(): xmiBase[] {
        const imports = super.references;

        //Inject attributes type
        this.attributes.forEach(attribute =>
            attribute.typeRef && ArrayUtils.insertIfNotExists(attribute.typeRef, imports));

        //Inject operation parameters and return types
        this.operations.forEach(operation => {
            operation.returnParameter.typeRef &&
                ArrayUtils.insertIfNotExists(operation.returnParameter.typeRef, imports);

            //Inject operation input parameter types
            operation.inputParameters
                .forEach(param => param.typeRef && ArrayUtils.insertIfNotExists(param.typeRef, imports));
        });

        return imports;
    }

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);
        this.refresh(raw, parent);
    }

    refresh(raw: any, parent?: xmiPackage): this {
        super.refreshBase(raw, parent);

        if(raw.ownedAttribute) {
            this.attributes = raw.ownedAttribute
                .map((x: any) => <xmiAttribute>this._factory.get(x, this))
                .filter((x: xmiAttribute) => x.name);
        } else {
            this.attributes = get(raw, ['attributes', '0', 'attribute'], [])
                .map((x: any) => <xmiAttribute>this._factory.get(x, this))
                .filter((x: xmiAttribute) => x.name);
        }

        if(raw.ownedOperation) {
            this.operations = raw.ownedOperation
                .map((x: any, i: number) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation(x, this, this._factory));
        } else {
            this.operations = get(raw, ['operations','0','operation'], [])
                .map((x: any, i: number) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation(x, this, this._factory));
        }

        if(raw.generalization) {
            this.generalization = new xmiGeneralization(get(raw, 'generalization.0'), this, this._factory);
        }

        this.attributes.sort((a, b) => a.name > b.name ? 1 : -1);
        this.operations.sort((a, b) => a.name > b.name ? 1 : -1);

        forkJoin(this.attributes.map(x => x.onAfterInit))
            .subscribe(() => this.initialized());

        return this;
    }

    toConsole() {
        const key: string = super.toConsole();
        const ret: any = {[key]: {}};

        this.attributes.length && (ret[key].attributes = this.attributes.map(x => ({[x.name]: (x.typeRef ? `${x.typeRef.name}(${x.typeId})` : x.typeId)})));
        this.operations.length && (ret[key].operations = this.operations
            .reduce((prev: any, x) => {
                const returnParameter = x.parameters.find(x => x.name === 'return');
                prev[`${x.name}(${x.parameters.filter(x => x.name !== 'return').map(x => x.name).join(',')})`] =
                    returnParameter ? `${returnParameter.typeRef ? returnParameter.typeRef.name : returnParameter.type}${x.isReturnArray ? '[]' : ''}` : 'void';

                return prev;
            }, {}));

        return ret;
    }
}
