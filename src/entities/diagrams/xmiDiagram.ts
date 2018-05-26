import xmiBase from '../xmiBase';
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiPackage} from "../xmiPackage";
import {xmiCollaboration} from "../xmiCollaboration";

export class xmiDiagram extends xmiBase {
    get elementRef() {
        return (<xmiPackage>xmiComponentFactory.getByKey(this.raw.model[0].$.owner))
            .children.find(x => x instanceof xmiCollaboration);
    }

  constructor(raw: any, parent: xmiPackage | null) {
    super(raw, parent);

    this.type = this.raw.properties[0].$.type;
    this.name = this.raw.properties[0].$.name;
  }
}
