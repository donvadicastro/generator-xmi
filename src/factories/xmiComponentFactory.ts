import xmiBase from "../entities/xmiBase";
import {xmiInterface} from "../entities/xmiInterface";
import {xmiLink} from "../entities/links/xmiLink";
import {xmiPackage} from "../entities/xmiPackage";
import {xmiCollaboration} from "../entities/xmiCollaboration";
import {xmiDiagram} from "../entities/diagrams/xmiDiagram";
import {xmiScreen} from "../entities/ui/xmiScreen";
import {xmiGUIElement} from "../entities/ui/xmiGUIElement";
import {xmiUMLDiagram} from "../entities/diagrams/xmiUMLDiagram";
import {xmiMessageEndpoint} from "../connectors/xmiMessageEndpoint";
import {xmiAttribute} from "../entities/class/xmiAttribute";
import {xmiInOut} from "../entities/component/xmiInOut";
import {xmiUseCase} from "../entities/xmiUseCase";
import {xmiLifeline} from "../entities/xmiLifeline";
import {xmiFragment} from "../entities/collaboration/xmiFragment";
import {xmiMessage} from "../entities/collaboration/xmiMessage";
import xmiConnector from "../entities/connectors/xmiConnector";
import {xmiAssociation} from "../entities/connectors/xmiAssociation";
import {xmiInstanceSpecification} from "../entities/xmiInstanceSpecification";
import {xmiCombinedFragment} from "../entities/collaboration/xmiCombinedFragment";
import {get} from 'object-path';
import {xmiComment} from "../entities/xmiComment";
import {xmiComponent} from "../entities/xmiComponent";
import {xmiActor} from "../entities/xmiActor";
import {xmiBoundary} from "../entities/useCases/xmiBoundary";
import {xmiProvided} from "../entities/component/xmiProvided";
import {xmiEnumeration} from "../entities/xmiEnumeration";
import {xmiDataType} from "../entities/xmiDataType";
import {xmiClass} from "../entities/xmiClass";

const assert = require('assert');

type idHashRef = {source: any, property: string, callback?: (element: xmiBase) => void};
type idHashFn = (x: xmiBase) => void;

export class xmiComponentFactory {

    private _idHash: {[key: string]: xmiBase} = {};
    private _idHashDeffered: {[key: string]: (idHashRef | idHashFn)[]} = {};

    private _dependencyHash: {[key: string]: xmiBase} = {};
    private _classHash: {[name: string]: xmiBase} = {};
    private _connectorHash: {[name: string]: any} = {};

    private _lifelineHash: xmiLifeline[] = [];
    private _fragmentHash: xmiFragment[] = [];
    private _initDeffered: any[] = [];

    private _errors: string[] = [];

    private static _instance = new xmiComponentFactory();

    static get instance(): xmiComponentFactory {
        return this._instance;
    }

    get idHash() { return this._idHash; }
    get idHashDeffered() { return this._idHashDeffered; }
    get classHash() { return this._classHash; }
    get connectorHash() { return this._connectorHash; }
    get lifelineHash(): xmiLifeline[] { return this._lifelineHash; }
    get fragmentHash(): xmiFragment[] { return this._fragmentHash; }
    get initDeffered() { return this._initDeffered; }
    get errors() { return this._errors; };

    static get(raw: any, parent?: xmiPackage | xmiInterface | xmiCollaboration, options?: any): xmiBase | null {
        let element = this.getByKey(raw.$['xmi:id']);

        //elements collection was parsed without parent applied
        if(element && !element.parent) {
            element.parent = parent;
        }

        switch (raw.$['xmi:type']) {
            case 'uml:Class':
                // Screen package elements are represented as classes
                if (element instanceof xmiScreen || element instanceof xmiGUIElement) {
                    element.parent = parent;
                    element.parseChildren(raw);
                }
                // when class already created
                else if(element instanceof xmiClass) {
                    element.refresh(raw, <xmiPackage>parent);
                }
                else if(element instanceof xmiMessageEndpoint || element instanceof xmiActor || element instanceof xmiBoundary) {
                    //no actions
                }
                // Collaboration as a class can happens when linked to another diagram
                else if(!(element instanceof xmiCollaboration) && !(element instanceof xmiUMLDiagram)) {
                    element = new xmiClass(raw, <xmiPackage>parent);
                    this.instance.classHash[element.nameOrigin] = element;
                }
                break;

            case 'uml:DataType':
                element = new xmiDataType(raw, <xmiPackage>parent);
                break;

            case 'uml:Interface':
                element = element ? (<xmiInterface>element).refresh(raw, <xmiPackage>parent) : new xmiInterface(raw, <xmiPackage>parent);
                break;

            case 'uml:Enumeration':
                element = new xmiEnumeration(raw, <xmiPackage>parent);
                break;

            case 'uml:Package':
                element = new xmiPackage(raw, <xmiPackage>parent);
                break;

            case 'uml:Collaboration':
                element = new xmiCollaboration(raw, <xmiPackage>parent);
                this.instance.initDeffered.push(element);
                break;

            case 'uml:Actor':
                const actor = require('../entities/xmiActor');
                element = new actor.xmiActor(raw, <xmiPackage>parent);
                break;

            case 'uml:InstanceSpecification':
                element = new xmiInstanceSpecification(raw, <xmiPackage>parent);
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

            case 'uml:Component':
                if(element instanceof xmiComponent) {
                    element.refreshComponent(raw);
                } else {
                    const c = require('../entities/xmiComponent');
                    element = new c.xmiComponent(raw, <xmiPackage>parent);
                }
                break;

            case 'uml:UseCase':
                element = element || new xmiUseCase(raw, parent);
                break;

            case 'uml:Boundary':
                element = new xmiBoundary(raw, <xmiPackage>parent);
                break;

            case 'uml:Lifeline':
                element = new xmiLifeline(raw, <xmiBase>parent, options);
                this.instance.lifelineHash.push(<xmiLifeline>element);
                break;

            case 'uml:CombinedFragment':
                element = new xmiCombinedFragment(raw, <xmiBase>parent, options);
                this.instance.fragmentHash.push(<xmiFragment>element);
                break;

            case 'uml:OccurrenceSpecification':
                element = new xmiFragment(raw, <xmiBase>parent, options);
                this.instance.fragmentHash.push(<xmiFragment>element);
                break;

            case 'uml:Message':
                element = new xmiMessage(raw, <xmiCollaboration>parent);
                break;

            case 'uml:Association':
                element = new xmiAssociation(raw);
                break;

            case 'uml:Note':
            case 'uml:Comment':
                element = new xmiComment(raw, parent);
                break;

            case 'uml:ProvidedInterface':
            case 'uml:RequiredInterface':
                element = element ? (<xmiInOut>element).refresh(raw, <xmiPackage>parent) : new xmiInOut(raw, <xmiPackage>parent);
                break;

            default:
                element = element || new xmiBase(raw, parent);
                break;

        }

        //basic mapping
        if (element && raw.$['xmi:id']) {
            this.instance.idHash[raw.$['xmi:id']] = element;
        } else if (element && raw.$['xmi:idref']) {
            this.instance.idHash[raw.$['xmi:idref']] = element;
        }

        //package extended mapping
        if(element instanceof xmiPackage) {
            const package2: string = get(raw, 'model.0.$.package2');
            package2 && (this.instance.idHash[package2] = element);
        }

        if(!element) {
            throw `Component creation error: ${raw.$['xmi:type']}(${raw.$['xmi:id'] || raw.$['xmi:ifrefs']})`;
        }

        return element;
    }

    static getDiagram(raw: any, parent?: xmiPackage) {
        const element = new xmiDiagram(raw, parent);

        this.instance.idHash[raw.$['xmi:id']] = element;
        return element;
    }

    static getLink(raw: any, parent: xmiBase) {
        const link = new xmiLink(raw, parent);

        this.instance.idHash[raw.$['xmi:id']] = link;
        return link;
    }

    static getConnector(raw: any) {
        const connector = new xmiConnector(raw);

        this.instance.connectorHash[raw.$['xmi:idref']] = connector;
        return connector;
    }

    static registerProvide(raw: any, register: xmiComponent) {
        const provide = new xmiProvided(raw, register);
        this.instance._dependencyHash[(<xmiInOut>provide.linkRef).name] = register;

        return provide;
    }

    static resolveDependency(key: string): xmiBase {
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
     * @param {(element: xmiBase) => {}} callback executing when key resolved
     */
    static getByKeyDeffered(source: any, property: string, key: string, callback?: (element: xmiBase) => void) {
        this.instance.idHashDeffered[key] || (this.instance.idHashDeffered[key] = []);
        this.instance.idHashDeffered[key].push({source: source, property: property, callback: callback});
    }

    /**
     * Deffered reference linking
     * @param source
     * @param {string} property
     * @param {string} key
     */
    static resolveKeyDeffered(key: string, callback: (x: xmiBase) => void) {
        this.instance.idHashDeffered[key] || (this.instance.idHashDeffered[key] = []);
        this.instance.idHashDeffered[key].push(callback);
    }

    static initialize() {
        this.instance.initDeffered.forEach(x => x.initialize());
    }

    /**
     * Update deffered references
     */
    static updateRefs() {
        for(let key in this.instance.idHashDeffered) {
            this.instance.idHashDeffered[key].forEach((ref: idHashFn | idHashRef) => {
                const matchClassName = /EAJava_(\w+(__)?)/.exec(key);
                let link = this.instance.idHash[key];

                //key can be link to class name
                if(matchClassName && matchClassName.length > 1) {
                    link = this.instance.classHash[matchClassName[1].replace('__', '')];
                }

                assert(link, `No link for "${key}"`);

                // this.instance.idHash[key] || console.log(`Null ref for "${ref.property}": ${key}`);
                // assert(this.instance.idHash[key], `Null ref for "${ref.property}": ${key}`);

                if(typeof ref === 'function') {
                    ref(this.instance.idHash[key]);
                } else {
                    const element = this.instance.idHash[key];

                    if (Array.isArray(ref.source[ref.property])) {
                        ref.source[ref.property].push(element);
                    } else {
                        ref.source[ref.property] = element;
                    }

                    ref.callback && ref.callback(this.instance.idHash[key]);
                }
            });
        }

        this.instance._idHashDeffered = {};
    }

    static logError(error: string) {
        this.instance.errors.push(error);
    }
}
