import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../src/xmiParser";
import {xmiPackage} from "../../../src/entities/xmiPackage";
import * as fs from "fs";
import {xmiClass} from "../../../src/entities/xmiClass";
import {IAttribute} from "../../../src/contracts/attribute";
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
                expect((<IAttribute>addressClass.attributesCombined.find(x => x.name === 'personRef')).isParent).toBeTruthy();
                expect((<IAttribute>personClass.attributesCombined.find(x => x.name === 'addressRef')).isParent).toBeFalsy();
            });
        });

        describe('Association relation', () => {
            let classDiagramPackage: xmiPackage;
            beforeAll(() => { classDiagramPackage = entities[1]; }); //select appropriate package

            it('Verify reference', () => {
                const addressClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
                const personClass: xmiClass = <xmiClass>classDiagramPackage.children[2];

                expect(addressClass.links.association.length).toBe(1);
                expect(personClass.links.association.length).toBe(1);

                expect(addressClass.links.association[0].start).toEqual(addressClass);
                expect(addressClass.links.association[0].end).toEqual(personClass);

                expect(addressClass.links.association[0].connector.source.typeRef).toBe(addressClass);
                expect(addressClass.links.association[0].connector.source.aggregation).toBe('none');
                expect(addressClass.links.association[0].connector.target.typeRef).toBe(personClass);
                expect(addressClass.links.association[0].connector.target.aggregation).toBe('none');

                expect(personClass.links.association[0].start).toEqual(addressClass);
                expect(personClass.links.association[0].end).toEqual(personClass);

                // address has association relation, so both left and right classes are equivalent, no parent
                expect((<IAttribute>addressClass.attributesCombined.find(x => x.name === 'personRef')).isParent).toBeFalsy();
                expect((<IAttribute>personClass.attributesCombined.find(x => x.name === 'addressRef')).isParent).toBeFalsy();
            });
        });

        describe('Aggregation relation', () => {
            let classDiagramPackage: xmiPackage;
            beforeAll(() => { classDiagramPackage = entities[3]; }); //select appropriate package

            it('Verify reference', () => {
                const carClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
                const personClass: xmiClass = <xmiClass>classDiagramPackage.children[2];

                expect(carClass.links.aggregation.length).toBe(1);
                expect(personClass.links.aggregation.length).toBe(1);

                expect(carClass.links.aggregation[0].start).toEqual(carClass);
                expect(carClass.links.aggregation[0].end).toEqual(personClass);

                expect(carClass.links.aggregation[0].connector.source.typeRef).toBe(carClass);
                expect(carClass.links.aggregation[0].connector.source.aggregation).toBe('none');
                expect(carClass.links.aggregation[0].connector.target.typeRef).toBe(personClass);
                expect(carClass.links.aggregation[0].connector.target.aggregation).toBe('shared');

                expect(personClass.links.aggregation[0].start).toEqual(carClass);
                expect(personClass.links.aggregation[0].end).toEqual(personClass);

                // address has association relation, so both left and right classes are equivalent, no parent
                expect((<IAttribute>carClass.attributesCombined.find(x => x.name === 'personRef')).isParent).toBeTruthy();
                expect((<IAttribute>personClass.attributesCombined.find(x => x.name === 'carRef')).isParent).toBeFalsy();
            });
        });
    });
});
