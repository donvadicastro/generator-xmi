import {get} from 'object-path';
import {xmiComponentFactory} from "./factories/xmiComponentFactory";
import {xmiPackage} from "./entities";
import {DialectType} from "./types";

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
    errors: string[] = [];

    constructor(data: any) {
        this.data = data;
    }

    async parse(dialect: DialectType = 'js'): Promise<boolean> {
        //clean factory
        const factory = new xmiComponentFactory(dialect);

        this.connectors = get(this.data, this.CONNECTORS_PATH, [])
            .map((x: any) => factory.getConnector(x));

        this.elements = get(this.data, this.ELEMENTS_PATH, [])
            .map((x: any) => factory.get(x));

        this.packge = <xmiPackage>factory.get(get(this.data, this.PACKAGE_ROOT));
        this.diagrams = (get(this.data, this.DIAGRAMS_PATH, [])).map(x => factory.getDiagram(x));

        // update references
        await factory.initialize();

        this.errors = factory.errors;
        return this.errors.length === 0;
    }

    toConsole() {
        const output: any = {};

        if (this.packge) {
            output.Package = this.packge.toConsole();
        }

        if(this.errors.length) {
            output.Errors = this.errors;
        }

        return output;
    }
}
