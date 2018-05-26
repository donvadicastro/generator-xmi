import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";

describe('xmiParser', () => {
    describe('Tree', () => {
        const data = readJSONSync('test/data/project1.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify package tree', () => {
            expect(parser.packge.name).toBe('model');
            expect(parser.packge.children[0].name).toBe('useCaseModel');

            const pkgTypes = parser.packge.children[0].children;
            expect(pkgTypes.length).toBe(3);
            expect(pkgTypes[0].name).toBe('components');
            expect(pkgTypes[1].name).toBe('diagrams');
            expect(pkgTypes[2].name).toBe('entities');

            const components = pkgTypes[0].children;
            expect(components[0].name).toBe('buyAuto');
            expect(components[1].name).toBe('makeMoney');
            expect(components[2].name).toBe('sellHouse');

            const diagrams = pkgTypes[1].children;
            expect(diagrams[0].name).toBe('eaCollaboration1');

            const entities = pkgTypes[2].children;
            expect(entities[0].name).toBe('building');
            expect(entities[1].name).toBe('team');
            expect(entities[2].name).toBe('contracts');
            expect(entities[2].children[0].name).toBe('iBuild');
        });
    });
});