import xmiBase from "../xmiBase";
import {xmiInterface} from "../xmiInterface";
import {xmiInOut} from "./xmiInOut";
import {xmiComponent} from "../xmiComponent";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

const assert = require('assert');

export class xmiRequired extends xmiBase {
    typeRef: xmiInterface | null = null;
    linkRef: xmiInOut;

    constructor(raw: any, parent: xmiComponent) {
        super(raw, parent);

        const typeRefId = raw.$['xmi:idref'];
        const linkRefId = raw.$['xmi:id'];

        this.linkRef = <xmiInOut>xmiComponentFactory.getByKey(linkRefId);
        xmiComponentFactory.getByKeyDeffered(this, 'linkRef', linkRefId);

        assert(typeRefId, `There is no required or provided interface specified for "${parent.name} -> ${parent.path.map(x => x.name).join(' -> ')}" component`);
        this.typeRef = <xmiInterface>xmiComponentFactory.getByKey(typeRefId);
        xmiComponentFactory.getByKeyDeffered(this, 'typeRef', typeRefId);
    }
}
