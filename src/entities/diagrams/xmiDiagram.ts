import xmiBase from '../xmiBase';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiPackage} from "../xmiPackage";
import {xmiCollaboration} from "../xmiCollaboration";

export class xmiDiagram extends xmiBase {
    get elementRef() {
        return (<xmiPackage>this._factory.getByKey(this._raw.model[0].$.owner))
            .children.find(x => x instanceof xmiCollaboration);
    }

  constructor(raw: any, parent: xmiPackage | null, factory: xmiComponentFactory) {
    super(raw, parent, factory);

    this.type = this._raw.properties[0].$.type;
    this.name = this._raw.properties[0].$.name;
  }
}
