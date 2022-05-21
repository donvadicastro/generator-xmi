import * as fs from "fs";
import {XmiParser} from "../../src";
import {xmiPackage} from "../../src";
import * as path from "path";
import {xmiComponent} from "../../src";

const parseString = require('xml2js').parseString;

describe('xmiParser', () => {
    describe('Components', () => {
        let entities: any[];

        beforeAll((done) => {
            parseString(fs.readFileSync(path.resolve('./resources/models/fixtures.xml')), async (err: any, result: any) => {
                const parser = new XmiParser(result);
                parser.parse().then(() => {
                    const pkg = <xmiPackage>parser.packge;
                    entities = (<xmiPackage>pkg.children[4]).children;

                    done();
                });
            });
        });

        describe('Assembly relation', () => {
            let componentDiagramPackage: xmiPackage;
            beforeAll(() => { componentDiagramPackage = entities[3]; }); //select appropriate package

            it('Verify reference', () => {
                const domainService: xmiComponent = <xmiComponent>componentDiagramPackage.children[1];
                const logger: xmiComponent = <xmiComponent>componentDiagramPackage.children[2];
                const storage: xmiComponent = <xmiComponent>componentDiagramPackage.children[4];

                expect(domainService.connectors.length).toBe(2);
                expect(domainService.connectors[0].source.typeRef).toBe(domainService);
                expect(domainService.connectors[0].target.typeRef).toBe(logger);
                expect(domainService.connectors[1].source.typeRef).toBe(domainService);
                expect(domainService.connectors[1].target.typeRef).toBe(storage);

                expect(logger.required).toEqual([]);
                expect(logger.provided.length).toBe(1);
                expect(logger.provided[0].typeRef).toBe(logger);
                expect(logger.provided[0].linkRef).toBe(logger);

                expect(storage.required).toEqual([]);
                expect(storage.provided.length).toBe(1);
                expect(storage.provided[0].typeRef).toBe(storage);
                expect(storage.provided[0].linkRef).toBe(storage);

                expect(domainService.provided).toEqual([]);
                expect(domainService.required.length).toBe(2);
                expect(domainService.required[0].typeRef).toBe(logger);
                expect(domainService.required[1].typeRef).toBe(storage);
            });
        });
    });
});
