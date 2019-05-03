import xmiBase from "./xmiBase";
import {xmiOperation} from "./class/xmiOperation";
import {get} from "object-path";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiGeneralization} from "./connectors/xmiGeneralization";
import {Reference} from "../types/reference";
import {xmiEnumeration} from "./xmiEnumeration";

const pascal = require('to-pascal-case');

export class xmiInterface extends xmiBase {
    attributes: xmiAttribute[] = [];
    operations: xmiOperation[] = [];
    generalization?: xmiGeneralization;

    get references(): Reference {
        const imports = super.references;

        //Inject attributes type
        this.attributes.forEach(attribute => {
            if(attribute.typeRef) {
                imports['../' + this.getRelativePath(attribute.typeRef) +
                    (attribute.isEnum ? '/enums/' : '/contracts/') + attribute.typeRef.name] = attribute.typeRef.name + 'Contract';
            }
        });

        //Inject operation parameters and return types
        this.operations.forEach(operation => {
            if(operation.returnParameter.typeRef) {
                imports['../' + this.getRelativePath(operation.returnParameter.typeRef) + '/contracts/' + operation.returnParameter.typeRef.name] =
                    operation.returnParameter.typeRef.name + 'Contract';
            }

            //Inject operation input parameter types
            operation.inputParameters.forEach(param => {
                param.typeRef && (imports['../' + this.getRelativePath(param.typeRef) + '/contracts/' + param.typeRef.name] =
                        param.typeRef.name + 'Contract');
            });
        });

        return imports;
    }

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);
        this.refresh(raw, parent);
    }

    refresh(raw: any, parent?: xmiPackage): this {
        super.refreshBase(raw, parent);

        if(raw.ownedAttribute) {
            this.attributes = raw.ownedAttribute
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this))
                .filter((x: xmiAttribute) => x.name);
        } else {
            this.attributes = get(raw, ['attributes', '0', 'attribute'], [])
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this))
                .filter((x: xmiAttribute) => x.name);
        }

        if(raw.ownedOperation) {
            this.operations = raw.ownedOperation
                .map((x: any, i: number) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation(x, this));
        } else {
            this.operations = get(raw, ['operations','0','operation'], [])
                .map((x: any, i: number) => this.operations[i] ? this.operations[i].refresh(x) : new xmiOperation(x, this));
        }

        if(raw.generalization) {
            this.generalization = new xmiGeneralization(get(raw, 'generalization.0'), this);
        }

        return this;
    }

    toConsole() {
        const key: string = super.toConsole();
        const ret: any = {[key]: {}};

        this.attributes.length && (ret[key].attributes = this.attributes.map(x => ({[x.name]: (x.typeRef ? `${x.typeRef.name}(${x.type})` : x.type)})));
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
