import xmiBase from "./xmiBase";
import {xmiOperation} from "./class/xmiOperation";
import {get} from "object-path";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiGeneralization} from "./connectors/xmiGeneralization";

const pascal = require('to-pascal-case');

export class xmiInterface extends xmiBase {
    attributes: xmiAttribute[] = [];
    operations: xmiOperation[] = [];
    generalization?: xmiGeneralization;

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);
        this.refresh(raw, parent);
    }

    refresh(raw: any, parent: xmiPackage | null) {
        if(raw.ownedAttribute) {
            this.attributes = raw.ownedAttribute
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this));
        } else {
            this.attributes = get(raw, ['attributes', '0', 'attribute'], [])
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this));
        }

        if(raw.ownedOperation) {
            this.operations = raw.ownedOperation
                .map((x: any) => new xmiOperation(x, this));
        } else {
            this.operations = get(raw, ['operations','0','operation'], [])
                .map((x: any) => new xmiOperation(x, this));
        }

        if(raw.generalization) {
            this.generalization = new xmiGeneralization(get(raw, 'generalization.0'), this);
        }
    }

    toConsole() {
        const key: string = super.toConsole();
        const ret: any = {[key]: {}};

        this.attributes.length && (ret[key].attributes = this.attributes.map(x => ({[x.name]: x.type})));
        this.operations.length && (ret[key].operations = this.operations.map(x => ({[x.name]: x.parameters.map(x => x.name).join(',')})));

        return ret;
    }
}
