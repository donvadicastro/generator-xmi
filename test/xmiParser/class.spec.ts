import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiPackage} from "../../src/entities/xmiPackage";

describe('xmiParser', () => {
    describe('Classes', () => {
        const data = readJSONSync('test/data/project2_class.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify class structure', () => {
            const entities = (<xmiPackage>parser.packge.children[0]).children;
            const building: xmiClass = <xmiClass>entities[0];
            const team: xmiClass = <xmiClass>entities[1];

            //building
            expect(building.attributes.length).toBe(1);
            expect(building.attributes[0].name).toBe('code');
            expect(building.attributes[0].type).toBe('number');

            expect(building.operations.length).toBe(1);
            expect(building.operations[0].name).toBe('build');
            expect(building.operations[0].parameters.length).toBe(2);
            expect(building.operations[0].parameters[0].name).toBe('big');
            expect(building.operations[0].parameters[0].type).toBe('boolean');
            expect(building.operations[0].parameters[1].name).toBe('return');
            expect(building.operations[0].parameters[1].type).toBe('void');

            //team
            expect(team.attributes.length).toBe(2);
            expect(team.attributes[0].name).toBe('description');
            expect(team.attributes[0].type).toBe('string');
            expect(team.attributes[1].name).toBe('name');
            expect(team.attributes[1].type).toBe('string');

            expect(team.operations.length).toBe(1);
            expect(team.operations[0].name).toBe('create');
            expect(team.operations[0].parameters.length).toBe(2);
            expect(team.operations[0].parameters[0].name).toBe('x');
            expect(team.operations[0].parameters[0].type).toBe('number');
            expect(team.operations[0].parameters[1].name).toBe('return');
            expect(team.operations[0].parameters[1].type).toBe('void');
        });
    });
});