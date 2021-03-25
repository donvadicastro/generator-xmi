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

    factory: xmiComponentFactory = new xmiComponentFactory();
    elements: any[] = [];
    connectors: any[] = [];
    diagrams: any;
    packge: xmiPackage | null = null;

    constructor(data: any) {
        this.data = data;
    }

    async parse(): Promise<boolean> {
        //clean factory
        this.factory = new xmiComponentFactory();

        this.connectors = get(this.data, this.CONNECTORS_PATH, [])
            .map((x: any) => this.factory.getConnector(x));

        this.elements = get(this.data, this.ELEMENTS_PATH, [])
            .map((x: any) => this.factory.get(x));

        this.packge = <xmiPackage>this.factory.get(get(this.data, this.PACKAGE_ROOT));
        this.diagrams = (get(this.data, this.DIAGRAMS_PATH, [])).map(x => this.factory.getDiagram(x));

        // update references
        await this.factory.initialize();

        return this.factory.errors.length === 0;
    }

    toConsole() {
        const output: any = {};

        if (this.packge) {
            output.Package = this.packge.toConsole();
        }

        if(this.factory.errors.length) {
            output.Errors = this.factory.errors;
        }

        return output;
    }
}
