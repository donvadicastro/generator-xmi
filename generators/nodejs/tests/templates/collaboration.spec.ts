import {XmiParser} from "generator-xmi-core";
import {xmiPackage} from "generator-xmi-core";
import '../../../common/tests/utils/normilize';
import {xmiCollaboration} from "generator-xmi-core";
import {readJSONSync} from "fs-extra";
import {parseString} from "xml2js";
import * as fs from "fs";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Collaboration with condition', () => {
                const dir = path.resolve( __dirname, '../../../../generators/nodejs/templates/partial/collaboration');
                const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project11_activity_condition.json'));
                const parser = new XmiParser(data);

                beforeAll(async () => await parser.parse());

                it('check conditions', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call classA
                        state.history.push('--> classA::afn1');
                        state.value = await this.cmpClassA.afn1();

                        // classA call classB
                        state.history.push('--> classB::bfn1');
                        state.value = await this.cmpClassB.bfn1();

                        // classA call classB
                        if(this.cmpClassA['a >= b'](state)) {
                            state.history.push('--> classB::bfn2');
                            state.value = await this.cmpClassB.bfn2();
                        } else {
                            state.history.push('--> \\x1b[43mclassB::bfn2: 0 ms\\x1b[m <- ignored by condition');
                        }

                        // classA call classB
                        if(this.cmpClassA['a < b'](state)) {
                            state.history.push('--> classB::bfn3');
                            state.value = await this.cmpClassB.bfn3();
                        } else {
                            state.history.push('--> \\x1b[43mclassB::bfn3: 0 ms\\x1b[m <- ignored by condition');
                        }
                    `.normalizeSpace());
                });
            });

            describe('Collaboration with loop', () => {
                let data: any, parser: XmiParser;
                const dir = path.resolve(__dirname, '../../../../generators/nodejs/templates/partial/collaboration');

                beforeEach((done) => {
                    parseString(fs.readFileSync(path.resolve(__dirname, '../../../../resources/models/fixtures.xml')), (err: any, result: any) => { data = result; done(); });
                });

                beforeEach(async () => {
                    parser = new XmiParser(data);
                    await parser.parse();
                });

                it('check loop', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.x1SimpleLoop.eaCollaboration1'));
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call componentA1
                        state.history.push('--> componentA1::actionA1');
                        state.value = await this.cmpComponentA1.actionA1();

                        // componentA1 call componentB1
                        state.history.push('--> componentB1::actionB1');
                        state.value = await this.cmpComponentB1.actionB1();

                        // componentA1 call componentB1
                        state.value = await Promise.all(state.resetActionStart().value.map(async (x: any): Promise<any> => {
                            // componentA1 call componentB1
                            state.history.push('--> componentB1::actionB2');
                            return await this.cmpComponentB1.actionB2();
                        }));`.normalizeSpace());
                });

                it('check loop with final call', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.x2SimpleLoopWithFinalCall.eaCollaboration2'));
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call componentA2
                        state.history.push('--> componentA2::actionA1');
                        state.value = await this.cmpComponentA2.actionA1();

                        // componentA2 call componentB2
                        state.value = await Promise.all(state.resetActionStart().value.map(async (x: any): Promise<any> => {
                            // componentA2 call componentB2
                            state.history.push('--> componentB2::actionB1');
                            return await this.cmpComponentB2.actionB1();
                        }));

                        // componentA2 call componentB2
                        state.history.push('--> componentB2::actionB2');
                        state.value = await this.cmpComponentB2.actionB2();
                    `.normalizeSpace());
                });
            });
        });
    });
});
