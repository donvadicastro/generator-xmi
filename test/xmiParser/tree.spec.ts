import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";

describe('xmiParser', () => {
    describe('Tree', () => {
        const data = readJSONSync('test/data/project1.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify package tree', () => {
            expect(parser.packge.name).toBe('Model');
            expect(parser.packge.children[0].name).toBe('Use Case Model');

            const pkgTypes = parser.packge.children[0].children;
            expect(pkgTypes.length).toBe(3);
            expect(pkgTypes[0].name).toBe('Components');
            expect(pkgTypes[1].name).toBe('Diagrams');
            expect(pkgTypes[2].name).toBe('Entities');

            const components = pkgTypes[0].children;
            expect(components[0].name).toBe('BuyAuto');
            expect(components[1].name).toBe('MakeMoney');
            expect(components[2].name).toBe('SellHouse');

            const diagrams = pkgTypes[1].children;
            expect(diagrams[0].name).toBe('EA_Collaboration1');

            const entities = pkgTypes[2].children;
            expect(entities[0].name).toBe('Building');
            expect(entities[1].name).toBe('Team');
            expect(entities[2].name).toBe('Contracts');
            expect(entities[2].children[0].name).toBe('IBuild');
        });
    });
});