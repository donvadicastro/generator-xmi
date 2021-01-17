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
            const pkg = <xmiPackage>parser.packge;
            const entities = (<xmiPackage>pkg.children[0]).children;
            const c1: xmiComponent = <xmiComponent>entities[1];

            // attributes
            expect(c1.attributes.length).toBe(1);
            expect(c1.attributes[0].name).toBe('attr1');
            expect(c1.attributes[0].type).toBe('number');

            // operations
            expect(c1.operations.length).toBe(1);
            expect(c1.operations[0].name).toBe('fn1');
            expect(c1.operations[0].parameters.length).toBe(1);
            expect(c1.operations[0].parameters[0].name).toBe('return');
            expect(c1.operations[0].parameters[0].type).toBe('void');

            // in
            expect(c1.required).not.toBeNull();
            expect(c1.required.length).toBe(1);
            expect(c1.required[0].name).toBe('in');
            expect(c1.required[0].typeRef).toBe((<xmiPackage>entities[5]).children[0]); //Contracts -> In

            // out
            expect(c1.provided.length).toBe(1);
            expect(c1.provided[0].name).toBe('out');
            expect(c1.provided[0].typeRef).toBe((<xmiPackage>entities[5]).children[1]); //Contracts -> Out
        });
    });

    describe('Component dependencies', () => {
        const data = readJSONSync('test/data/project9_component_dep.json');
        const parser = new XmiParser(data);

        parser.parse();
        const pkg = <xmiPackage>parser.packge;
        const entities = (<xmiPackage>pkg.children[0]).children;
        const classes = (<xmiPackage>pkg.children[1]).children;

        const root: xmiComponent = <xmiComponent>entities[2];
        const dep1: xmiComponent = <xmiComponent>entities[4];
        const dep2: xmiComponent = <xmiComponent>entities[3];

        const config: xmiInterface = <xmiComponent>classes[2];
        const http: xmiInterface = <xmiComponent>classes[1];
        const httpOptions: xmiInterface = <xmiComponent>classes[0];

        it('Verify component structure', () => {
            expect(root.name).toBe('rootComponent');
            expect(dep1.name).toBe('dep1Component');
            expect(dep2.name).toBe('dep2Component');
        });

        it('Verify class structure', () => {
            expect(config.name).toBe('iConfig');
            expect(http.name).toBe('iHttp');
            expect(httpOptions.name).toBe('iHttpOptions');
        });

        it('Verify component realize', () => {
            expect(dep1.required).toEqual([]);
            expect(dep1.provided.length).toBe(1);
            expect(dep1.provided[0].typeRef).toBe(classes[2]);
            expect(dep1.provided[0].linkRef.owner).toBe(dep1);

            expect(dep2.required).toEqual([]);
            expect(dep2.provided.length).toBe(1);
            expect(dep2.provided[0].typeRef).toBe(classes[1]);
            expect(dep2.provided[0].linkRef.owner).toBe(dep2);

            expect(root.provided).toEqual([]);
            expect(root.required.length).toBe(2);
            expect(root.required[0].typeRef).toBe(classes[1]);
            expect(root.required[1].typeRef).toBe(classes[2]);
        });
    });
});
