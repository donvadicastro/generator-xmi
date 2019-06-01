import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {xmiClass} from "../../src/entities/xmiClass";

describe('xmiParser', () => {
    describe('Classes', () => {
        it('Verify custom', () => {
            const data = readJSONSync('test/data/_tokenability.json');
            const parser = new XmiParser(data);

            parser.parse();
            const pkg = <xmiPackage>parser.packge;
            const entities = (<xmiPackage>pkg.children[0]).children;
            const building: xmiClass = <xmiClass>entities[4];
            const team: xmiClass = <xmiClass>entities[9];
            const location: xmiClass = <xmiClass>entities[6];

            //building
            expect(building.attributes.length).toBe(1);
            expect(building.attributes[0].name).toBe('code');
            expect(building.attributes[0].type).toBe('number');

            expect(building.operations.length).toBe(1);
            expect(building.operations[0].name).toBe('build');
            expect(building.operations[0].inputParameters.length).toBe(1);
            expect(building.operations[0].inputParameters[0].name).toBe('big');
            expect(building.operations[0].inputParameters[0].type).toBe('boolean');
            expect(building.operations[0].returnParameter.name).toBe('return');
            expect(building.operations[0].returnParameter.type).toBe('void');

            //team
            expect(team.attributes.length).toBe(2);
            expect(team.attributes[0].name).toBe('description');
            expect(team.attributes[0].type).toBe('string');
            expect(team.attributes[1].name).toBe('name');
            expect(team.attributes[1].type).toBe('string');

            expect(team.operations.length).toBe(2);
            expect(team.operations[0].name).toBe('create');
            expect(team.operations[0].inputParameters.length).toBe(1);
            expect(team.operations[0].inputParameters[0].name).toBe('x');
            expect(team.operations[0].inputParameters[0].type).toBe('number');
            expect(team.operations[0].returnParameter.name).toBe('return');
            expect(team.operations[0].returnParameter.type).toBe('void');

            expect(team.operations[1].name).toBe('getBaseLocation');
            expect(team.operations[1].inputParameters.length).toBe(0);
            expect(team.operations[1].returnParameter.name).toBe('return');
            expect(team.operations[1].returnParameter.typeRef).toBe(location);
        });

        it('Verify association', () => {
            const data = readJSONSync('test/data/project2_class_associations.json');
            const parser = new XmiParser(data);

            parser.parse();

            const pkg = <xmiPackage>(<xmiPackage>parser.packge).children[0];
            const aircraft = pkg.children[0] as xmiClass;
            const airline = pkg.children[3] as xmiClass;

            expect(aircraft.associationLinks[1].target.typeRef).toBe(airline);
            expect(aircraft.associationLinks[1].target.multiplicity).toBe("1");

            expect(airline.associationLinks[0].target.typeRef).toBe(aircraft);
            expect(airline.associationLinks[0].target.multiplicity).toBe("0..*");
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

            expect(a.generalizationLinks.length).toBe(4);
            expect(a.generalizationLinks[0].target.typeRef).toBe(a1);
            expect(a.generalizationLinks[1].target.typeRef).toBe(a2);
            expect(a.generalizationLinks[2].target.typeRef).toBe(a4);
            expect(a.generalizationLinks[3].target.typeRef).toBe(a3);
            expect(a.generalizationLinksTo).toBeNull();

            expect(a1.generalizationLinks.length).toBe(1);
            expect(a1.generalizationLinks[0].target.typeRef).toBe(a);
            expect(a1.generalizationLinksTo).toBe(a);

            expect(a2.generalizationLinks.length).toBe(1);
            expect(a2.generalizationLinks[0].target.typeRef).toBe(a);
            expect(a2.generalizationLinksTo).toBe(a);

            expect(person.generalizationLinks.length).toBe(1);
            expect(person.generalizationLinks[0].target.typeRef).toBe(student);
            expect(student.generalizationLinks[0].target.typeRef).toBe(person);
            expect(student.generalizationLinksTo).toBe(person);
        });
    });
});
