import {xmiAbstractClass} from "../base/xmiAbstractClass";

export class xmiClass extends xmiAbstractClass {
    override toConsole(): any {
        if(!this.attributes.find(x => x.name === 'name') && !this.tags.displayName) {
            this._factory.logError(
                `Class "${this.name} (${this.id}) -> ${this.pathToRoot.map(x => x.name).join(' -> ')}" should contains "name" attribute or defined "displayName" tag instead`);
        }

        return super.toConsole();
    }
}
