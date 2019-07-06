import {xmiGUIElement} from "./xmiGUIElement";
import {xmiPackage} from "../xmiPackage";

export class xmiScreen extends xmiGUIElement {
    constructor(raw: any, parent: xmiPackage) {
        super(raw, parent);
    }
}
