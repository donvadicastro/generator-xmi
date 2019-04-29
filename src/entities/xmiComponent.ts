import {xmiClass} from "./xmiClass";
import {xmiPackage} from "./xmiPackage";
import {xmiInOut} from "./component/xmiInOut";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiComponent extends xmiClass {
    provided: xmiInOut[] = [];
    required: xmiInOut[] = [];

    constructor(raw: any, parent?: xmiPackage) {
        super(raw, parent);
        this.refreshComponent(raw);
    }

    refreshComponent(raw: any, parent?: xmiPackage) {
        super.refresh(raw, parent);

        if(raw.links && raw.links.length && raw.links[0].Sequence) {
            this.links.sequence = raw.links[0].Sequence.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(raw.links && raw.links.length && raw.links[0].Usage) {
            this.links.usage = raw.links[0].Usage.map((x: any) => xmiComponentFactory.getLink(x, this));
        }

        if(raw.provided) {
            this.provided = raw.provided.map((x: any) => xmiComponentFactory.registerProvide(x, this));
        }

        if(raw.required) {
            this.required = raw.required.map((x: any) => new xmiInOut(x));
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
