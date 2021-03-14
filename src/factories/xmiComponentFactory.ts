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
import {xmiText} from "../xmiText";
import {forkJoin, Observable, ReplaySubject} from "rxjs";
import {last, tap} from "rxjs/operators";

const assert = require('assert');

type idHashRef = {source: any, property: string, callback?: (element: xmiBase) => void};
type idHashFn = (x: xmiBase) => void;

export class xmiComponentFactory {
    /**
     * Resolved elements stream.
     * @private
     */
    private _resolvedElements = new ReplaySubject<xmiBase>();
    private _allSubscriptions: Observable<any>[] = [];

    //private _source = publish<xmiBase>()(this._resolvedElements.pipe() as ConnectableObservable<xmiBase>);

    private _idHash: {[key: string]: xmiBase} = {};
    private _idHashDeffered: {[key: string]: (idHashRef | idHashFn)[]} = {};

    private _classHash: {[name: string]: xmiBase} = {};
    private _connectorHash: {[name: string]: any} = {};

    private _lifelineHash: xmiLifeline[] = [];
    private _fragmentHash: xmiFragment[] = [];
    private _initDeffered: any[] = [];

    private _errors: string[] = [];
    private _afterParseCallbacks: (() => void)[] = [];

    get resolvedElements() { return this._resolvedElements; }
    get idHash() { return this._idHash; }
    get idHashDeffered() { return this._idHashDeffered; }
    get classHash() { return this._classHash; }
    get connectorHash() { return this._connectorHash; }
    get lifelineHash(): xmiLifeline[] { return this._lifelineHash; }
    get fragmentHash(): xmiFragment[] { return this._fragmentHash; }
    get initDeffered() { return this._initDeffered; }
    get errors() { return this._errors; };
    get afterParseCallbacks() { return this._afterParseCallbacks; };

    /**
     * Resolve dependency.
     * @param id
     */
    resolveById(id: string): Observable<xmiBase | undefined> {
        // console.log('RESOLVING ', id);
        const subscription = this._resolvedElements.pipe(
            last((x, i) => {
                return x.id === id;
            }), tap(x => {
                // console.log('RESOLVED ', x?.id);
            }));

        this._allSubscriptions.push(subscription);
        return subscription;
    }

    /**
     * Resolve dependency and mark element as fully initialized.
     * @param element
     * @param id
     */
    resolveByIdAndChangeState(element: xmiBase, id: string): Observable<xmiBase | undefined> {
        // console.log('RESOLVING ', id);
        const subscription = this._resolvedElements.pipe(
            last(x => {
                return x.id === id;
            }), tap(x => {
                // console.log('RESOLVED ', x?.id);
                element.initialized();
            }));

        this._allSubscriptions.push(subscription);
        return subscription;
    }

    get(raw: any, parent?: xmiPackage | xmiInterface | xmiCollaboration | xmiGUIElement, options?: any): xmiBase | null {
        let element = this.getByKey(raw.$['xmi:id']);

        //elements collection was parsed without parent applied
        if(element && !element.parent) {
            element.parent = parent || null;
        }

        switch (raw.$['xmi:type']) {
            case 'uml:Class':
                // Screen package elements are represented as classes
                if (element instanceof xmiScreen || element instanceof xmiGUIElement) {
                    element.parent = parent || null;
                    element.parseChildren(raw);
                }
                // when class already created
                else if(element instanceof xmiClass) {
                    element.refresh(raw, <xmiPackage>parent);
                }
                else if(element instanceof xmiMessageEndpoint || element instanceof xmiActor || element instanceof xmiBoundary || element instanceof xmiText) {
                    //no actions
                }
                // Collaboration as a class can happens when linked to another diagram
                else if(!(element instanceof xmiCollaboration) && !(element instanceof xmiUMLDiagram)) {
                    element = new xmiClass(raw, <xmiPackage>parent, this);
                    this.classHash[element.nameOrigin] = element;
                }
                break;

            case 'uml:DataType':
                element = new xmiDataType(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Interface':
                element = element ? (<xmiInterface>element).refresh(raw, <xmiPackage>parent) : new xmiInterface(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Enumeration':
                element = new xmiEnumeration(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Package':
                element = new xmiPackage(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Collaboration':
                element = new xmiCollaboration(raw, <xmiPackage>parent, this);
                this.initDeffered.push(element);
                break;

            case 'uml:Actor':
                const actor = require('../entities/xmiActor');
                element = new actor.xmiActor(raw, <xmiPackage>parent, this);
                break;

            case 'uml:InstanceSpecification':
                element = new xmiInstanceSpecification(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Screen':
                element = new xmiScreen(raw, <xmiPackage>parent, this);
                break;

            case 'uml:GUIElement':
                element = new xmiGUIElement(raw, <xmiPackage>parent, this);
                break;

            case 'uml:UMLDiagram':
                element = new xmiUMLDiagram(raw, <xmiPackage>parent, this);
                break;

            case 'uml:MessageEndpoint':
                element = new xmiMessageEndpoint(raw, parent || null, this);
                break;

            case 'uml:Property':
                element = new xmiAttribute(raw, parent || null, this);
                break;

            case 'uml:Component':
                if(element instanceof xmiComponent) {
                    element.refreshComponent(raw);
                } else {
                    const c = require('../entities/xmiComponent');
                    element = new c.xmiComponent(raw, <xmiPackage>parent, this);
                }
                break;

            case 'uml:UseCase':
                element = element || new xmiUseCase(raw, <xmiBase>parent, this);
                break;

            case 'uml:Boundary':
                element = new xmiBoundary(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Lifeline':
                element = new xmiLifeline(raw, <xmiBase>parent, this, options);
                this.lifelineHash.push(<xmiLifeline>element);
                break;

            case 'uml:CombinedFragment':
                element = new xmiCombinedFragment(raw, <xmiBase>parent, this, options);
                this.fragmentHash.push(<xmiFragment>element);
                break;

            case 'uml:OccurrenceSpecification':
                element = new xmiFragment(raw, <xmiBase>parent, this, options);
                this.fragmentHash.push(<xmiFragment>element);
                break;

            case 'uml:Message':
                element = new xmiMessage(raw, <xmiCollaboration>parent, this);
                break;

            case 'uml:Association':
                element = new xmiAssociation(raw, this);
                break;

            case 'uml:Note':
            case 'uml:Comment':
                element = new xmiComment(raw, parent || null, this);
                break;

            case 'uml:ProvidedInterface':
            case 'uml:RequiredInterface':
                element = element ? (<xmiInOut>element).refresh(raw, <xmiPackage>parent) : new xmiInOut(raw, <xmiPackage>parent, this);
                break;

            case 'uml:Connector':
                break;

            case 'uml:Text':
                element = new xmiText(raw, parent || null, this);
                break;

            default:
                element = element || new xmiBase(raw, parent || null, this);
                break;

        }

        //basic mapping
        if (element && raw.$['xmi:id']) {
            this.idHash[raw.$['xmi:id']] = element;
        } else if (element && raw.$['xmi:idref']) {
            this.idHash[raw.$['xmi:idref']] = element;
        }

        //package extended mapping
        if(element instanceof xmiPackage) {
            const package2: string = get(raw, 'model.0.$.package2');
            package2 && (this.idHash[package2] = element);
        }

        if(!element) {
            throw `Component creation error: ${raw.$['xmi:type']}(${raw.$['xmi:id'] || raw.$['xmi:ifrefs']})`;
        }

        this.resolvedElements.next(element);
        return element;
    }

    getDiagram(raw: any, parent?: xmiPackage) {
        const element = new xmiDiagram(raw, parent || null, this);

        this.idHash[raw.$['xmi:id']] = element;
        return element;
    }

    getLink(raw: any, parent: xmiBase) {
        const link = new xmiLink(raw, parent, this);

        this.idHash[raw.$['xmi:id']] = link;
        return link;
    }

    getConnector(raw: any) {
        const connector = new xmiConnector(raw, this);

        this.connectorHash[raw.$['xmi:idref']] = connector;
        return connector;
    }

    getConnectorByKey(key: string): xmiBase {
        return this.connectorHash[key];
    }

    registerProvide(raw: any, register: xmiComponent) {
        return new xmiProvided(raw, register, this);
    }

    getByKey(key: string): xmiBase {
        return this.idHash[key];
    }

    /**
     * Deffered reference linking
     * @param source
     * @param {string} property
     * @param {string} key
     */
    resolveKeyDeffered(key: string, callback: (x: xmiBase) => void) {
        this.idHashDeffered[key] || (this.idHashDeffered[key] = []);
        this.idHashDeffered[key].push(callback);
    }

    initialize(): void {
        // console.log('CONNECT to subscribers');
        // this._source.connect();
        this.initDeffered.forEach(x => x.initialize());
    }

    /**
     * Update deffered references
     */
    updateRefs() {
        for(let key in this.idHashDeffered) {
            this.idHashDeffered[key].forEach((ref: idHashFn | idHashRef) => {
                const matchClassName = /EAJava_(\w+(__)?)/.exec(key);
                let link = this.idHash[key];

                //key can be link to class name
                if(matchClassName && matchClassName.length > 1) {
                    link = this.classHash[matchClassName[1].replace('__', '')];
                }

                assert(link, `No link for "${key}"`);

                // this.idHash[key] || console.log(`Null ref for "${ref.property}": ${key}`);
                // assert(this.idHash[key], `Null ref for "${ref.property}": ${key}`);

                if(typeof ref === 'function') {
                    ref(this.idHash[key]);
                } else {
                    const element = this.idHash[key];

                    if (Array.isArray(ref.source[ref.property])) {
                        ref.source[ref.property].push(element);
                    } else {
                        ref.source[ref.property] = element;
                    }

                    ref.callback && ref.callback(this.idHash[key]);
                }
            });
        }

        this._idHashDeffered = {};

        // post construct
        this.afterParseCallbacks.forEach(x => x());
        this.afterParseCallbacks.length = 0;

        this._resolvedElements.complete();
        return forkJoin(this._allSubscriptions).toPromise();
    }

    registerPostCallback(callback: () => void) {
        this.afterParseCallbacks.push(callback);
    }

    logError(error: string) {
        this.errors.push(error);
    }
}
