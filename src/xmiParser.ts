import {get} from 'object-path';
import {xmiComponentFactory} from "./factories/xmiComponentFactory";
import {xmiPackage} from "./entities/xmiPackage";

export class XmiParser {
    private ELEMENTS_PATH = ['xmi:XMI', 'xmi:Extension', '0', 'elements', '0', 'element'];
    private CONNECTORS_PATH = ['xmi:XMI', 'xmi:Extension', '0', 'connectors', '0', 'connector'];
    private DIAGRAMS_PATH = ['xmi:XMI', 'xmi:Extension', '0', 'diagrams', '0', 'diagram'];
    private PACKAGE_ROOT = ['xmi:XMI', 'uml:Model', '0', 'packagedElement', '0'];

    /**
     * Input data
     */
    private data: any;

    elements: any[] = [];
    connectors: any[] = [];
    diagrams: any;
    packge: xmiPackage | null = null;

    constructor(data: any) {
        this.data = data;
    }

    parse() {
        this.connectors = get(this.data, this.CONNECTORS_PATH, [])
            .map((x: any) => xmiComponentFactory.getConnector(x));

        this.elements = get(this.data, this.ELEMENTS_PATH, [])
            .filter((x: any) => x.$.name).map((x: any) => xmiComponentFactory.get(x));

        this.packge = <xmiPackage>xmiComponentFactory.get(get(this.data, this.PACKAGE_ROOT));
        this.diagrams = (get(this.data, this.DIAGRAMS_PATH, [])).map(x => xmiComponentFactory.getDiagram(x));

        //run initializers
        xmiComponentFactory.initialize();

        // update references
        xmiComponentFactory.updateRefs();
    }

    toConsole() {
        if (this.packge) {
            return {Package: this.packge.toConsole()};
        }
    }
}
