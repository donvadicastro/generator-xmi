import xmiBase from "../xmiBase";
import {xmiInterface} from "../xmiInterface";
import {xmiComponent} from "../xmiComponent";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const assert = require('assert');

export class xmiRequired extends xmiBase {
    typeRef?: xmiInterface;
    linkRef?: xmiInterface;

    constructor(raw: any, parent: xmiComponent, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        const typeRefId = raw.$['xmi:idref'];
        const linkRefId = raw.$['xmi:id'];

        assert(typeRefId, `There is no required or provided interface specified for "${parent.name} -> ${parent.pathToRoot.map(x => x.name).join(' -> ')}" component`);

        this._factory.resolveById(linkRefId).subscribe(x => this.linkRef = <xmiInterface>x);
        this._factory.resolveById(typeRefId).subscribe(x => this.typeRef = <xmiInterface>x);
    }
}
