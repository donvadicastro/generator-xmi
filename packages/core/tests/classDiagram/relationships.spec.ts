import {xmiClass, xmiPackage, XmiParser, IAttribute} from "../../src";
import * as fs from "fs";

const parseString = require('xml2js').parseString;
const path = require('path');

describe('xmiParser', () => {
  describe('Classes', () => {
    let entities: any[];

    beforeAll((done) => {
      parseString(fs.readFileSync(path.resolve(__dirname, '../../../../resources/models/fixtures.xml')), (err: any, result: any) => {
        const parser = new XmiParser(result);

        parser.parse().then(() => {
          const pkg = <xmiPackage>parser.packge;
          entities = (<xmiPackage>pkg.children[2]).children;

          done();
        });
      });
    });

    describe('Composition relation', () => {
      let classDiagramPackage: xmiPackage;
      beforeAll(() => {
        classDiagramPackage = entities[2];
      }); //select appropriate package

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
        const personRefAttr = (<IAttribute>addressClass.attributesCombined.find(x => x.name === 'personRef'));
        expect(personRefAttr.isParent).toBeTruthy();
        expect(personRefAttr.linkType).toBe('composite');

        const addressRefAttr = (<IAttribute>personClass.attributesCombined.find(x => x.name === 'addressRef'));
        expect(addressRefAttr.isParent).toBeFalsy();
        expect(addressRefAttr.linkType).toBe('composite');
      });
    });

    describe('Association relation', () => {
      let classDiagramPackage: xmiPackage;
      beforeAll(() => {
        classDiagramPackage = entities[1];
      }); //select appropriate package

      it('Verify reference', () => {
        const addressClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
        const personClass: xmiClass = <xmiClass>classDiagramPackage.children[7];

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
        const personRefAttr = (<IAttribute>addressClass.attributesCombined.find(x => x.name === 'personRef'));
        expect(personRefAttr.isParent).toBeFalsy();
        expect(personRefAttr.linkType).toBe('none');

        const addressRefAttr = (<IAttribute>personClass.attributesCombined.find(x => x.name === 'addressRef'));
        expect(addressRefAttr.isParent).toBeFalsy();
        expect(addressRefAttr.linkType).toBe('none');
      });
    });

    describe('Aggregation relation', () => {
      let classDiagramPackage: xmiPackage;
      beforeAll(() => {
        classDiagramPackage = entities[3];
      }); //select appropriate package

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

        // address has aggregation relation, so child is a link to existing
        const personRefAttr = (<IAttribute>carClass.attributesCombined.find(x => x.name === 'personRef'));
        expect(personRefAttr.isParent).toBeTruthy();
        expect(personRefAttr.linkType).toBe('shared');

        const carRefAttr = (<IAttribute>personClass.attributesCombined.find(x => x.name === 'carRef'));
        expect(carRefAttr.isParent).toBeFalsy();
        expect(carRefAttr.linkType).toBe('shared');
      });
    });

    describe('Generalization relation (inheritance)', () => {
      let classDiagramPackage: xmiPackage;
      beforeAll(() => {
        classDiagramPackage = entities[4];
      }); //select appropriate package

      it('Verify reference', () => {
        const studentClass: xmiClass = <xmiClass>classDiagramPackage.children[1];
        const personClass: xmiClass = <xmiClass>classDiagramPackage.children[0];

        expect(studentClass.links.generalization.length).toBe(1);
        expect(personClass.links.generalization.length).toBe(1);

        expect(studentClass.links.generalization[0].start).toEqual(studentClass);
        expect(studentClass.links.generalization[0].end).toEqual(personClass);

        expect(personClass.links.generalization[0].start).toEqual(studentClass);
        expect(personClass.links.generalization[0].end).toEqual(personClass);

        expect(personClass.generalizationLinksFrom).toEqual([studentClass]);
        expect(personClass.generalizationLinksTo).toBeNull();
        expect(studentClass.generalizationLinksFrom).toEqual([]);
        expect(studentClass.generalizationLinksTo).toEqual(personClass);

        // address has association relation, so both left and right classes are equivalent, no parent
        expect(studentClass.attributesCombined.map(x => x.name)).toEqual(['cource']);
        expect(personClass.attributesCombined.map(x => x.name)).toEqual(['firstName', 'lastName']);
      });
    });

    describe('Relization relation (interface implementation)', () => {
      let classDiagramPackage: xmiPackage;
      beforeAll(() => {
        classDiagramPackage = entities[5];
      }); //select appropriate package

      it('Verify reference', () => {
        const printerClass: xmiClass = <xmiClass>classDiagramPackage.children[0];
        const setupInterface: xmiClass = <xmiClass>classDiagramPackage.children[1];

        expect(printerClass.links.realization.length).toBe(1);
        expect(printerClass.links.realization[0].start).toEqual(setupInterface);
        expect(printerClass.links.realization[0].end).toEqual(printerClass);

        expect(printerClass.implements).toEqual([setupInterface]);
      });
    });
  });
});
