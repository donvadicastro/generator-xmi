"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiComponentFactory = void 0;
const xmiBase_1 = __importDefault(require("../entities/xmiBase"));
const xmiInterface_1 = require("../entities/xmiInterface");
const xmiLink_1 = require("../entities/links/xmiLink");
const xmiPackage_1 = require("../entities/xmiPackage");
const xmiCollaboration_1 = require("../entities/xmiCollaboration");
const xmiDiagram_1 = require("../entities/diagrams/xmiDiagram");
const xmiScreen_1 = require("../entities/ui/xmiScreen");
const xmiGUIElement_1 = require("../entities/ui/xmiGUIElement");
const xmiUMLDiagram_1 = require("../entities/diagrams/xmiUMLDiagram");
const xmiMessageEndpoint_1 = require("../connectors/xmiMessageEndpoint");
const xmiAttribute_1 = require("../entities/class/xmiAttribute");
const xmiInOut_1 = require("../entities/component/xmiInOut");
const xmiUseCase_1 = require("../entities/xmiUseCase");
const xmiLifeline_1 = require("../entities/xmiLifeline");
const xmiFragment_1 = require("../entities/collaboration/xmiFragment");
const xmiMessage_1 = require("../entities/collaboration/xmiMessage");
const xmiConnector_1 = __importDefault(require("../entities/connectors/xmiConnector"));
const xmiAssociation_1 = require("../entities/connectors/xmiAssociation");
const xmiInstanceSpecification_1 = require("../entities/xmiInstanceSpecification");
const xmiCombinedFragment_1 = require("../entities/collaboration/xmiCombinedFragment");
const object_path_1 = require("object-path");
const xmiComment_1 = require("../entities/xmiComment");
const xmiComponent_1 = require("../entities/xmiComponent");
const xmiActor_1 = require("../entities/xmiActor");
const xmiBoundary_1 = require("../entities/useCases/xmiBoundary");
const xmiProvided_1 = require("../entities/component/xmiProvided");
const xmiEnumeration_1 = require("../entities/xmiEnumeration");
const xmiDataType_1 = require("../entities/xmiDataType");
const xmiClass_1 = require("../entities/xmiClass");
const xmiText_1 = require("../xmiText");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class xmiComponentFactory {
    constructor(dialect) {
        this.dialect = dialect;
        /**
         * Resolved elements stream.
         * @private
         */
        this.resolvedElements = new rxjs_1.ReplaySubject();
        this.allSubscriptions = [];
        this.idHash = {};
        this.classHash = {};
        this.connectorHash = {};
        this.lifelineHash = [];
        this.fragmentHash = [];
        this.errors = [];
    }
    /**
     * Resolve dependency.
     * @param id
     */
    resolveById(id) {
        // console.log('RESOLVING ', id);
        const subscription = this.resolvedElements.pipe(operators_1.last((x, i) => {
            return x.id === id;
        }), operators_1.tap(x => {
            // console.log('RESOLVED ', x?.id);
        }));
        this.allSubscriptions.push(subscription);
        return subscription;
    }
    get(raw, parent, options) {
        let element = this.getByKey(raw.$['xmi:id']);
        //elements collection was parsed without parent applied
        if (element && !element.parent) {
            element.parent = parent || null;
        }
        switch (raw.$['xmi:type']) {
            case 'uml:Class':
                // Screen package elements are represented as classes
                if (element instanceof xmiScreen_1.xmiScreen || element instanceof xmiGUIElement_1.xmiGUIElement) {
                    element.parent = parent || null;
                    element.parseChildren(raw);
                }
                // when class already created
                else if (element instanceof xmiClass_1.xmiClass) {
                    element.refresh(raw, parent);
                }
                else if (element instanceof xmiMessageEndpoint_1.xmiMessageEndpoint || element instanceof xmiActor_1.xmiActor || element instanceof xmiBoundary_1.xmiBoundary || element instanceof xmiText_1.xmiText) {
                    //no actions
                }
                // Collaboration as a class can happens when linked to another diagram
                else if (!(element instanceof xmiCollaboration_1.xmiCollaboration) && !(element instanceof xmiUMLDiagram_1.xmiUMLDiagram)) {
                    element = new xmiClass_1.xmiClass(raw, parent, this);
                    this.classHash[element.nameOrigin] = element;
                }
                break;
            case 'uml:DataType':
                element = new xmiDataType_1.xmiDataType(raw, parent, this);
                break;
            case 'uml:Interface':
                element = element ? element.refresh(raw, parent) : new xmiInterface_1.xmiInterface(raw, parent, this);
                break;
            case 'uml:Enumeration':
                element = new xmiEnumeration_1.xmiEnumeration(raw, parent, this);
                break;
            case 'uml:Package':
                element = new xmiPackage_1.xmiPackage(raw, parent, this);
                break;
            case 'uml:Collaboration':
                element = new xmiCollaboration_1.xmiCollaboration(raw, parent, this);
                break;
            case 'uml:Actor':
                const actor = require('../entities/xmiActor');
                element = new actor.xmiActor(raw, parent, this);
                break;
            case 'uml:InstanceSpecification':
                element = new xmiInstanceSpecification_1.xmiInstanceSpecification(raw, parent, this);
                break;
            case 'uml:Screen':
                element = new xmiScreen_1.xmiScreen(raw, parent, this);
                break;
            case 'uml:GUIElement':
                element = new xmiGUIElement_1.xmiGUIElement(raw, parent, this);
                break;
            case 'uml:UMLDiagram':
                element = new xmiUMLDiagram_1.xmiUMLDiagram(raw, parent, this);
                break;
            case 'uml:MessageEndpoint':
                element = new xmiMessageEndpoint_1.xmiMessageEndpoint(raw, parent || null, this);
                break;
            case 'uml:Property':
                element = new xmiAttribute_1.xmiAttribute(raw, parent || null, this);
                break;
            case 'uml:Component':
                if (element instanceof xmiComponent_1.xmiComponent) {
                    element.refreshComponent(raw);
                }
                else {
                    const c = require('../entities/xmiComponent');
                    element = new c.xmiComponent(raw, parent, this);
                }
                break;
            case 'uml:UseCase':
                element = element || new xmiUseCase_1.xmiUseCase(raw, parent, this);
                break;
            case 'uml:Boundary':
                element = new xmiBoundary_1.xmiBoundary(raw, parent, this);
                break;
            case 'uml:Lifeline':
                element = new xmiLifeline_1.xmiLifeline(raw, parent, this, options);
                this.lifelineHash.push(element);
                break;
            case 'uml:CombinedFragment':
                element = new xmiCombinedFragment_1.xmiCombinedFragment(raw, parent, this, options);
                this.fragmentHash.push(element);
                break;
            case 'uml:OccurrenceSpecification':
                element = new xmiFragment_1.xmiFragment(raw, parent, this, options);
                this.fragmentHash.push(element);
                break;
            case 'uml:Message':
                element = new xmiMessage_1.xmiMessage(raw, parent, this);
                break;
            case 'uml:Association':
                element = new xmiAssociation_1.xmiAssociation(raw, this);
                break;
            case 'uml:Note':
            case 'uml:Comment':
                element = new xmiComment_1.xmiComment(raw, parent || null, this);
                break;
            case 'uml:ProvidedInterface':
            case 'uml:RequiredInterface':
                element = element ? element.refresh(raw, parent) : new xmiInOut_1.xmiInOut(raw, parent, this);
                break;
            case 'uml:Connector':
                break;
            case 'uml:Text':
                element = new xmiText_1.xmiText(raw, parent || null, this);
                break;
            default:
                element = element || new xmiBase_1.default(raw, parent || null, this);
                break;
        }
        //basic mapping
        if (element && raw.$['xmi:id']) {
            this.idHash[raw.$['xmi:id']] = element;
        }
        else if (element && raw.$['xmi:idref']) {
            this.idHash[raw.$['xmi:idref']] = element;
        }
        //package extended mapping
        if (element instanceof xmiPackage_1.xmiPackage) {
            const package2 = object_path_1.get(raw, 'model.0.$.package2');
            package2 && (this.idHash[package2] = element);
        }
        if (!element) {
            throw `Component creation error: ${raw.$['xmi:type']}(${raw.$['xmi:id'] || raw.$['xmi:ifrefs']})`;
        }
        this.resolvedElements.next(element);
        return element;
    }
    getDiagram(raw, parent) {
        const element = new xmiDiagram_1.xmiDiagram(raw, parent || null, this);
        this.idHash[raw.$['xmi:id']] = element;
        return element;
    }
    getLink(raw, parent) {
        const link = new xmiLink_1.xmiLink(raw, parent, this);
        this.idHash[raw.$['xmi:id']] = link;
        return link;
    }
    getConnector(raw) {
        const connector = new xmiConnector_1.default(raw, this);
        this.connectorHash[raw.$['xmi:idref']] = connector;
        return connector;
    }
    getConnectorByKey(key) {
        return this.connectorHash[key];
    }
    registerProvide(raw, register) {
        return new xmiProvided_1.xmiProvided(raw, register, this);
    }
    getByKey(key) {
        return this.idHash[key];
    }
    initialize() {
        this.resolvedElements.complete();
        return rxjs_1.forkJoin(this.allSubscriptions).toPromise();
    }
    logError(error) {
        this.errors.push(error);
    }
}
exports.xmiComponentFactory = xmiComponentFactory;
//# sourceMappingURL=xmiComponentFactory.js.map