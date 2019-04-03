import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiPackage} from "../../src/entities/xmiPackage";

describe('xmiParser', () => {
    describe('Classes', () => {
        it('Verify custom', () => {
            const data = readJSONSync('test/data/project2_class.json');
            const parser = new XmiParser(data);

            parser.parse();
            const pkg = <xmiPackage>parser.packge;
            const entities = (<xmiPackage>pkg.children[0]).children;
            const building: xmiClass = <xmiClass>entities[4];
            const team: xmiClass = <xmiClass>entities[9];

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

        it('Verify association', () => {
            const data = readJSONSync('test/data/project2_class_associations.json');
            const parser = new XmiParser(data);

            parser.parse();

            const pkg = <xmiPackage>parser.packge;
            const aircraft = pkg.children[0] as xmiClass;
            const airplane = pkg.children[2] as xmiClass;

            expect(aircraft.associations[0].typeRef).toBe(airplane);
            expect(aircraft.associations[0].multiplicity).toBe("1");

            expect(airplane.associations[0].typeRef).toBe(aircraft);
            expect(airplane.associations[0].multiplicity).toBe("0..*");
        });

        it('Verify composition', () => {

        });

        it('Verify generalization', () => {
            const data = readJSONSync('test/data/project2_class_inheritance.json');
            const parser = new XmiParser(data);

            parser.parse();

            const pkg = <xmiPackage>(<xmiPackage>parser.packge).children[0];
            const a = pkg.children[0] as xmiClass;
            const a1 = pkg.children[1] as xmiClass;
            const a2 = pkg.children[2] as xmiClass;
            const a3 = pkg.children[3] as xmiClass;
            const a4 = pkg.children[4] as xmiClass;
            const person = pkg.children[5] as xmiClass;
            const student = pkg.children[6] as xmiClass;

            expect(a.generalizations.length).toBe(4);
            expect(a.generalizations[0].typeRef).toBe(a1);
            expect(a.generalizations[1].typeRef).toBe(a2);
            expect(a.generalizations[2].typeRef).toBe(a4);
            expect(a.generalizations[3].typeRef).toBe(a3);

            expect(a1.generalizations.length).toBe(1);
            expect(a1.generalizations[0].typeRef).toBe(a);

            expect(person.generalizations.length).toBe(1);
            expect(person.generalizations[0].typeRef).toBe(student);
            expect(student.generalizations[0].typeRef).toBe(person);
        });
    });
});
