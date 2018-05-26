import xmiBase from "./xmiBase";
import {xmiOperation} from "./class/xmiOperation";
import {get} from "object-path";
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiPackage} from "./xmiPackage";

export class xmiInterface extends xmiBase {
    attributes: xmiAttribute[];
    operations: xmiOperation[];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        if(this.raw.ownedAttribute) {
            this.attributes = this.raw.ownedAttribute
                .map((x: any) => new xmiAttribute(x, this));
        } else {
            this.attributes = get(this.raw, ['attributes', '0', 'attribute'], [])
                .map((x: any) => new xmiAttribute(x, this));
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
        const ret: any = super.toConsole();

        ret[this.name] = {
            attributes: this.attributes.map(x => ({[x.name]: x.type})),
            operations: this.operations.map(x => ({[x.name]: x.parameters.map(x => x.name).join(',')}))
        };

        return ret;
    }
}
