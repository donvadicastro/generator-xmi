import {xmiClass} from "./xmiClass";
import {xmiInOut} from "./component/xmiInOut";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiLink} from "./xmiLink";
import {xmiPackage} from "./xmiPackage";

export class xmiComponent extends xmiClass {
    links: {sequence: xmiLink[], usage: xmiLink[]} = {sequence: [], usage: []};

    provided: xmiInOut[] | null = null;
    required: xmiInOut[] | null = null;

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        if(raw.links && raw.links.length && raw.links[0].Sequence) {
            this.links.sequence = raw.links[0].Sequence.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(raw.links && raw.links.length && raw.links[0].Usage) {
            this.links.usage = raw.links[0].Usage.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(this.raw.provided) {
            this.provided = this.raw.provided.map((x: any) => xmiComponentFactory.registerProvide(x, this));
        }

        if(this.raw.required) {
            this.required = this.raw.required.map((x: any) => new xmiInOut(x, null));
        }
    }
}
