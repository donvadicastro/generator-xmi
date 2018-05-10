import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiComponent} from "../../src/entities/xmiComponent";

describe('xmiParser', () => {
    describe('Components', () => {
        const data = readJSONSync('test/data/project4_component.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify component structure', () => {
            const entities = parser.packge.children[0].children;
            const c1: xmiComponent = entities[1];

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
                expect(c1.required[0].name).toBe('In');
                expect(c1.required[0].ref).toBe(entities[3].children[0]); //Contracts -> In
            }

            // out
            expect(c1.provided).not.toBeNull();

            if(c1.provided != null) {
                expect(c1.provided.length).toBe(2);
                expect(c1.provided[0].name).toBe('Out');
                expect(c1.provided[0].ref).toBe(entities[3].children[1]); //Contracts -> Out
            }
        });
    });
});