import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../src/xmiParser";
import {xmiPackage} from "../../../src/entities/xmiPackage";
import * as fs from "fs";
import {xmiClass} from "../../../src/entities/xmiClass";
const parseString = require('xml2js').parseString;
const path = require('path');

describe('xmiParser', () => {
    describe('Classes', () => {
        let entities: any[];

        beforeAll((done) => {
            parseString(fs.readFileSync(path.resolve(__dirname, '../../data/fixtures.xml')), (err: any, result: any) => {
                const parser = new XmiParser(result);
                parser.parse();

                const pkg = <xmiPackage>parser.packge;
                entities = (<xmiPackage>pkg.children[2]).children;

                done();
            });
        });

        describe('Composition relation', () => {
            let classDiagramPackage: xmiPackage;
            beforeAll(() => { classDiagramPackage = entities[2]; }); //select appropriate package

            it('Verify reference', () => {
                const addressClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
                const personClass: xmiClass = <xmiClass>classDiagramPackage.children[2];

                expect(addressClass.links.aggregation.length).toBe(1);
                expect(personClass.links.aggregation.length).toBe(1);

                expect(addressClass.links.aggregation[0].start).toEqual(addressClass);
                expect(addressClass.links.aggregation[0].end).toEqual(personClass);

                expect(addressClass.links.aggregation[0].connector.source.typeRef).toBe(addressClass);
                expect(addressClass.links.aggregation[0].connector.source.aggregation).toBe('none');
                expect(addressClass.links.aggregation[0].connector.target.typeRef).toBe(personClass);
                expect(addressClass.links.aggregation[0].connector.target.aggregation).toBe('composite');

                expect(personClass.links.aggregation[0].start).toEqual(addressClass);
                expect(personClass.links.aggregation[0].end).toEqual(personClass);

                // address has composition relation, so avoid to use/change parent through attributes
                expect(addressClass.attributesCombined.find(x => x.name === 'personRef')).toBeUndefined();
                expect(personClass.attributesCombined.find(x => x.name === 'addressRef')).toBeDefined();
            });
        });
    });
});
