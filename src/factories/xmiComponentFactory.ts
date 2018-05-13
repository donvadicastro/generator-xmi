import xmiBase from "../entities/xmiBase";
import {xmiInterface} from "../entities/xmiInterface";
import {xmiClass} from "../entities/xmiClass";
import {xmiLink} from "../entities/xmiLink";
import {xmiComponent} from "../entities/xmiComponent";
import {xmiPackage} from "../entities/xmiPackage";
import {xmiCollaboration} from "../entities/xmiCollaboration";
import {xmiActor} from "../entities/xmiActor";
import {xmiDiagram} from "../entities/xmiDiagram";
import {xmiScreen} from "../entities/ui/xmiScreen";
import {xmiGUIElement} from "../entities/ui/xmiGUIElement";

export class xmiComponentFactory {
    private _idHash: {[key: string]: xmiBase} = {};
    private static _instance = new xmiComponentFactory();

    static get instance(): xmiComponentFactory {
        return this._instance;
    }

    get idHash() {
      return this._idHash;
}

    static get(raw: any): xmiBase | null {
        let element = this.getByKey(raw.$['xmi:id']);

        switch (raw.$['xmi:type']) {
            case 'uml:Class':
                // Screen package elements are represented as classes
                if (element instanceof xmiScreen || element instanceof xmiGUIElement) {
                    element.parseChildren(raw);
                } else {
                    element = new xmiClass(raw);
                }
                break;

            case 'uml:Component':
                element = new xmiComponent(raw);
                break;

            case 'uml:Interface':
                element = new xmiInterface(raw);
                break;

            case 'uml:Package':
                element = new xmiPackage(raw);
                break;

            case 'uml:Collaboration':
                element = new xmiCollaboration(raw);
                break;

            case 'uml:Actor':
                element = new xmiActor(raw);
                break;

            case 'uml:Screen':
                element = new xmiScreen(raw);
                break;

            case 'uml:GUIElement':
                element = new xmiGUIElement(raw);
                break;
        }

        if (element && raw.$['xmi:id']) {
            this.instance.idHash[raw.$['xmi:id']] = element;
        } else if (element && raw.$['xmi:idref']) {
            this.instance.idHash[raw.$['xmi:idref']] = element;
        }

        return element;
    }

    static getDiagram(raw: any) {
        const element = new xmiDiagram(raw);

        this.instance.idHash[raw.$['xmi:id']] = element;
        return element;
    }

    static getLink(raw: any) {
        const link = new xmiLink(raw);

        this.instance.idHash[raw.$['xmi:id']] = link;
        return link;
    }

    static getByKey(key: string): xmiBase {
        return this.instance.idHash[key];
    }
}
