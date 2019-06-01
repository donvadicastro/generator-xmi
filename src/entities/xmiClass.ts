import {xmiAbstractClass} from "../base/xmiAbstractClass";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiClass extends xmiAbstractClass {
    toConsole(): any {
        if(!this.attributes.find(x => x.name === 'name') && !this.tags.displayName) {
            xmiComponentFactory.logError(
                `Class "${this.name} -> ${this.path.map(x => x.name).join(' -> ')}" should contains "name" attribute or defined "displayName" tag instead`);
        }

        return super.toConsole();
    }
}
