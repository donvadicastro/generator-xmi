import {XmiParser} from "../../../src/xmiParser";
import {xmiPackage} from "../../../src/entities/xmiPackage";
import * as fs from "fs";
import {xmiClass} from "../../../src/entities/xmiClass";
import {xmiEnumeration} from "../../../src/entities/xmiEnumeration";

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
                entities = (<xmiPackage>pkg.children[3]).children;

                done();
            });
        });

        describe('Simple types', () => {});

        describe('Complex types', () => {
            let classDiagramPackage: xmiPackage;
            beforeAll(() => { classDiagramPackage = entities[1]; }); //select appropriate package

            it('Verify complex type property', () => {
                const personClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
                expect(personClass.attributesCombined.map(x => x.name)).toEqual(['address', 'name']);
                expect(personClass.attributesCombined[0].typeRef).toEqual(classDiagramPackage.children[1]); //address datatype
            });

            it('Verify complex type structure', () => {
                const addressClass: xmiClass = <xmiClass>classDiagramPackage.children[1];
                expect(addressClass.attributes.map(x => x.name)).toEqual(['city', 'isPrimary', 'state']);
                expect(addressClass.attributesCombinedToEdit.map(x => x.name)).toEqual(['city', 'isPrimary', 'state']);
            });

        });

        describe('Enums', () => {
            let classDiagramPackage: xmiPackage;
            beforeAll(() => { classDiagramPackage = entities[2]; }); //select appropriate package

            it('Verify enum property', () => {
                const personClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
                expect(personClass.attributesCombined.map(x => x.name)).toEqual(['title', 'type']);
                expect(personClass.attributesCombined[1].typeRef).toBeInstanceOf(xmiEnumeration); //enum
            });


            it('Verify enum content', () => {
                const typeClass: xmiEnumeration = <xmiEnumeration>classDiagramPackage.children[1];
                expect(typeClass.literals).toEqual(['Bug', 'Task']);
            });
        });
    });
});
