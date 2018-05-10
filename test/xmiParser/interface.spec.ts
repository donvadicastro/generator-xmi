import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiInterface} from "../../src/entities/xmiInterface";

describe('xmiParser', () => {
    describe('Interfaces', () => {
        const data = readJSONSync('test/data/project3_interface.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify interface realization', () => {
            const entities = parser.packge.children[0].children;
            const a: xmiClass = entities[0];
            const b: xmiInterface = entities[1];

            //A
            expect(a.attributes.length).toBe(0);

            expect(a.operations.length).toBe(2);
            expect(a.operations[0].name).toBe('fn1');
            expect(a.operations[0].parameters.length).toBe(2);
            expect(a.operations[0].parameters[0].name).toBe('x');
            expect(a.operations[0].parameters[0].type).toBe('EAJava_int');
            expect(a.operations[0].parameters[1].name).toBe('return');
            expect(a.operations[0].parameters[1].type).toBe('EAJava_void');
            expect(a.operations[1].parameters[0].name).toBe('y');
            expect(a.operations[1].parameters[0].type).toBe('EAJava_float');
            expect(a.operations[1].parameters[1].name).toBe('return');
            expect(a.operations[1].parameters[1].type).toBe('EAJava_boolean');

            //B
            expect(b.attributes.length).toBe(2);
            expect(b.attributes[0].name).toBe('attr1');
            expect(b.attributes[0].type).toBe('EAJava_int');
            expect(b.attributes[1].name).toBe('attr2');
            expect(b.attributes[1].type).toBe('EAJava_boolean');

            expect(b.operations.length).toBe(2);
            expect(b.operations[0].name).toBe('fn1');
            expect(b.operations[0].parameters.length).toBe(2);
            expect(b.operations[0].parameters[0].name).toBe('x');
            expect(b.operations[0].parameters[0].type).toBe('EAJava_int');
            expect(b.operations[0].parameters[1].name).toBe('return');
            expect(b.operations[0].parameters[1].type).toBe('EAJava_void');
            expect(b.operations[1].parameters[0].name).toBe('y');
            expect(b.operations[1].parameters[0].type).toBe('EAJava_float');
            expect(b.operations[1].parameters[1].name).toBe('return');
            expect(b.operations[1].parameters[1].type).toBe('EAJava_boolean');
        });
    });
});