import xmiBase from "./xmiBase";
import {xmiOperation} from "./class/xmiOperation";
import {get} from "object-path";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

const pascal = require('to-pascal-case');

export class xmiInterface extends xmiBase {
    attributes: xmiAttribute[];
    operations: xmiOperation[];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        if(this.raw.ownedAttribute) {
            this.attributes = this.raw.ownedAttribute
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this));
        } else {
            this.attributes = get(this.raw, ['attributes', '0', 'attribute'], [])
                .map((x: any) => <xmiAttribute>xmiComponentFactory.get(x, this));
        }

        if(this.raw.ownedOperation) {
            this.operations = this.raw.ownedOperation
                .map((x: any) => new xmiOperation(x, this));
        } else {
            this.operations = get(this.raw, ['operations','0','operation'], [])
                .map((x: any) => new xmiOperation(x, this));
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
