import xmiBase from "../entities/xmiBase";
import {xmiInterface} from "../entities/xmiInterface";
import {xmiClass} from "../entities/xmiClass";
import {xmiLink} from "../entities/xmiLink";
import {xmiComponent} from "../entities/xmiComponent";
import {xmiPackage} from "../entities/xmiPackage";
import {xmiCollaboration} from "../entities/xmiCollaboration";
import {xmiActor} from "../entities/xmiActor";
import {xmiDiagram} from "../entities/diagrams/xmiDiagram";
import {xmiScreen} from "../entities/ui/xmiScreen";
import {xmiGUIElement} from "../entities/ui/xmiGUIElement";
import {xmiUMLDiagram} from "../entities/diagrams/xmiUMLDiagram";
import {xmiMessageEndpoint} from "../connectors/xmiMessageEndpoint";
import {xmiAttribute} from "../entities/class/xmiAttribute";
import {xmiInOut} from "../entities/component/xmiInOut";

export class xmiComponentFactory {
    private _idHash: {[key: string]: xmiBase} = {};
    private _idHashDeffered: {[key: string]: {source: any, property: string}} = {};
    private _dependencyHash: {[key: string]: xmiBase} = {};

    private static _instance = new xmiComponentFactory();

    static get instance(): xmiComponentFactory {
        return this._instance;
    }

    get idHash() {
        return this._idHash;
    }

    get idHashDeffered() {
        return this._idHashDeffered;
    }

    static get(raw: any, parent: xmiPackage | xmiInterface | null): xmiBase | null {
        let element = this.getByKey(raw.$['xmi:id']);

        switch (raw.$['xmi:type']) {
            case 'uml:Class':
                // Screen package elements are represented as classes
                if (element instanceof xmiScreen || element instanceof xmiGUIElement) {
                    element.parent = parent;
                    element.parseChildren(raw);
                }
                // Collaboration as a class can happens when linked to another diagram
                else if(!(element instanceof xmiCollaboration) && !(element instanceof xmiUMLDiagram)) {
                    element = new xmiClass(raw, <xmiPackage>parent);
                }
                break;

            case 'uml:Component':
                element = new xmiComponent(raw, <xmiPackage>parent);
                break;

            case 'uml:Interface':
                element = new xmiInterface(raw, <xmiPackage>parent);
                break;

            case 'uml:Package':
                element = new xmiPackage(raw, <xmiPackage>parent);
                break;

            case 'uml:Collaboration':
                element = new xmiCollaboration(raw, <xmiPackage>parent);
                break;

            case 'uml:Actor':
                element = new xmiActor(raw, <xmiPackage>parent);
                break;

            case 'uml:Screen':
                element = new xmiScreen(raw, <xmiPackage>parent);
                break;

            case 'uml:GUIElement':
                element = new xmiGUIElement(raw, <xmiPackage>parent);
                break;

            case 'uml:UMLDiagram':
                element = new xmiUMLDiagram(raw, <xmiPackage>parent);
                break;

            case 'uml:MessageEndpoint':
                element = new xmiMessageEndpoint(raw, parent);
                break;

            case 'uml:Property':
                element = new xmiAttribute(raw, parent);
                break;
        }

        if (element && raw.$['xmi:id']) {
            this.instance.idHash[raw.$['xmi:id']] = element;
        } else if (element && raw.$['xmi:idref']) {
            this.instance.idHash[raw.$['xmi:idref']] = element;
        }

        return element;
    }

    static getDiagram(raw: any, parent: xmiPackage | null) {
        const element = new xmiDiagram(raw, parent);

        this.instance.idHash[raw.$['xmi:id']] = element;
        return element;
    }

    static getLink(raw: any, parent: xmiBase) {
        const link = new xmiLink(raw, parent);

        this.instance.idHash[raw.$['xmi:id']] = link;
        return link;
    }

    static registerProvide(raw: any, register: xmiBase) {
        const provide = new xmiInOut(raw, null);
        this.instance._dependencyHash[provide.name] = register;

        console.log('REGISTER', provide.name);
        return provide;
    }

    static resolveDependency(key: string): xmiBase {
        console.log('RESOLVE', key);
        return this.instance._dependencyHash[key];
    }

    static getByKey(key: string): xmiBase {
        return this.instance.idHash[key];
    }

    /**
     * Deffered reference linking
     * @param source
     * @param {string} property
     * @param {string} key
     */
    static getByKeyDeffered(source: any, property: string, key: string) {
        source[property] = this.getByKey(key);

        if (!source[property]) {
            this.instance.idHashDeffered[key] = {source: source, property: property};
        }
    }

    /**
     * Update deffered references
     */
    static updateRefs() {
        for(let key in this.instance.idHashDeffered) {
            const ref = this.instance.idHashDeffered[key];
            const link = this.instance.idHash[key];

            if(!link) {
                throw new Error(`No link for "${key}"`);
            }

            ref.source[ref.property] = this.instance.idHash[key];
        }

        this.instance._idHashDeffered = {};
    }
}
