import {xmiClass} from "./xmiClass";
import {xmiLink} from "./links/xmiLink";
import {xmiPackage} from "./xmiPackage";
import {xmiInOut} from "./component/xmiInOut";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiComponent extends xmiClass {

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

    toConsole() {
        const ret: any = super.toConsole();
        const key: string = Object.keys(ret)[0];

        this.required && (ret[key].required = this.required.map(x => x.name));
        this.provided && (ret[key].provided = this.provided.map(x => x.name));

        return ret;
    }
}
