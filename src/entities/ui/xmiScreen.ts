import {xmiGUIElement} from "./xmiGUIElement";
import {xmiPackage} from "../xmiPackage";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";

export class xmiScreen extends xmiGUIElement {
    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);
    }
}
