import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {xmiInterface} from "../../src/entities/xmiInterface";

describe('xmiParser', () => {
    describe('Components', () => {
        const data = readJSONSync('test/data/project4_component.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify component structure', () => {
            const entities = (<xmiPackage>parser.packge.children[0]).children;
            const c1: xmiComponent = <xmiComponent>entities[1];

            // attributes
            expect(c1.attributes.length).toBe(1);
            expect(c1.attributes[0].name).toBe('attr1');
            expect(c1.attributes[0].type).toBe('EAJava_int');

            // operations
            expect(c1.operations.length).toBe(1);
            expect(c1.operations[0].name).toBe('fn1');
            expect(c1.operations[0].parameters.length).toBe(1);
            expect(c1.operations[0].parameters[0].name).toBe('return');
            expect(c1.operations[0].parameters[0].type).toBe('EAJava_void');

            // in
            expect(c1.required).not.toBeNull();

            if(c1.required != null) {
                expect(c1.required.length).toBe(1);
                expect(c1.required[0].name).toBe('in');
                expect(c1.required[0].ref).toBe((<xmiPackage>entities[3]).children[0]); //Contracts -> In
            }

            // out
            expect(c1.provided).not.toBeNull();

            if(c1.provided != null) {
                expect(c1.provided.length).toBe(2);
                expect(c1.provided[0].name).toBe('out');
                expect(c1.provided[0].ref).toBe((<xmiPackage>entities[3]).children[1]); //Contracts -> Out
            }
        });
    });

    describe('Component dependencies', () => {
        const data = readJSONSync('test/data/project9_component_dep.json');
        const parser = new XmiParser(data);

        parser.parse();
        const entities = (<xmiPackage>parser.packge.children[0]).children;
        const classes = (<xmiPackage>parser.packge.children[1]).children;

        const root: xmiComponent = <xmiComponent>entities[0];
        const dep1: xmiComponent = <xmiComponent>entities[2];
        const dep2: xmiComponent = <xmiComponent>entities[1];

        it('Verify component structure', () => {
            expect(root.name).toBe('rootComponent');
            expect(dep1.name).toBe('dep1Component');
            expect(dep2.name).toBe('dep2Component');
        });

        it('Verify class structure', () => {
            const config: xmiInterface = <xmiComponent>classes[2];
            const http: xmiInterface = <xmiComponent>classes[1];
            const httpOptions: xmiInterface = <xmiComponent>classes[0];

            expect(config.name).toBe('iConfig');
            expect(http.name).toBe('iHttp');
            expect(httpOptions.name).toBe('iHttpOptions');
        });

        it('Verify component realize', () => {
            expect(dep1.required).toBeNull();
            expect(dep1.provided.length).toBe(1);
            expect(dep1.provided[0].ref).toBe(classes[2]);

            expect(dep2.required).toBeNull();
            expect(dep2.provided.length).toBe(1);
            expect(dep2.provided[0].ref).toBe(classes[1]);

            expect(root.provided).toBeNull();
            expect(root.required.length).toBe(2);
            expect(root.required[0].ref).toBe(classes[1]);
            expect(root.required[1].ref).toBe(classes[2]);
        });
    });
});