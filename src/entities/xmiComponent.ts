import {xmiClass} from "./xmiClass";
import {xmiInOut} from "./component/xmiInOut";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiComponent extends xmiClass {
    links: {sequence: any[], usage: any[]} = {sequence: [], usage: []};

    provided: xmiInOut[] | null = null;
    required: xmiInOut[] | null = null;

    constructor(raw: any) {
        super(raw);

        if(raw.links && raw.links.length && raw.links[0].Sequence) {
            this.links.sequence = raw.links[0].Sequence.map((x: any) => xmiComponentFactory.getLink(x));
        }

        if(raw.links && raw.links.length && raw.links[0].Usage) {
            this.links.usage = raw.links[0].Usage.map((x: any) => xmiComponentFactory.getLink(x));
        }

        if(this.raw.provided) {
            this.provided = this.raw.provided.map((x: any) => new xmiInOut(x));
        }

        if(this.raw.required) {
            this.required = this.raw.required.map((x: any) => new xmiInOut(x));
        }
    }
}
