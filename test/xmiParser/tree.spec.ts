import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiPackage} from "../../src/entities/xmiPackage";

const assert = require('assert');
jest.mock('assert');

describe('xmiParser', () => {
    jest.mock('assert');

    describe('Tree', () => {
        const data = readJSONSync('test/data/project1.json');
        const parser = new XmiParser(data);

        assert.mockResolvedValue(true);
        beforeEach(async () => await parser.parse());

        it('Verify package tree', async () => {
            const pkg = <xmiPackage>parser.packge;

            expect(pkg.name).toBe('model');
            expect(pkg.children[0].name).toBe('useCaseModel');

            const pkgTypes = (<xmiPackage>pkg.children[0]).children;
            expect(pkgTypes.length).toBe(3);
            expect(pkgTypes[0].name).toBe('components');
            expect(pkgTypes[1].name).toBe('diagrams');
            expect(pkgTypes[2].name).toBe('entities');

            const components = (<xmiPackage>pkgTypes[0]).children;
            expect(components[0].name).toBe('buyAuto');
            expect(components[1].name).toBe('makeMoney');
            expect(components[2].name).toBe('sellHouse');

            const diagrams = (<xmiPackage>pkgTypes[1]).children;
            expect(diagrams[0].name).toBe('eaCollaboration1');

            const entities = (<xmiPackage>pkgTypes[2]).children;
            expect(entities[0].name).toBe('building');
            expect(entities[2].name).toBe('team');
            expect(entities[3].name).toBe('contracts');
            expect((<xmiPackage>entities[3]).children[0].name).toBe('iBuild');
        });
    });
});
