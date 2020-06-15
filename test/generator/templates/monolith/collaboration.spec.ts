import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import '../../../../utils/normilize';
import {xmiCollaboration} from "../../../../src/entities/xmiCollaboration";

const parseString = require('xml2js').parseString;
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Collaboration with condition', () => {
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/collaboration');
                const data = readJSONSync('test/data/project11_activity_condition.json');
                const parser = new XmiParser(data);

                parser.parse();

                const pkg = <xmiPackage>parser.packge;
                const sequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];

                it('check conditions', async () => {
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call classA 
                        console.log('--> classA::afn1'); 
                        inputState.value = await this.cmpClassA.afn1(state.resetActionStart().value); 
                        
                        // classA call classB 
                        console.log('--> classB::bfn1'); 
                        inputState.value = await this.cmpClassB.bfn1(state.resetActionStart().value);
                    
                        // classA call classB
                        if(this.cmpClassA['a >= b'](state)) { 
                            console.log('--> classB::bfn2');
                            inputState.value = await this.cmpClassB.bfn2(state.resetActionStart().value);
                        } else {
                            console.log('--> \\x1b[43mclassB::bfn2: 0 ms\\x1b[m <- ignored by condition');
                        }
                    
                        // classA call classB
                        if(this.cmpClassA['a < b'](state)) { 
                            console.log('--> classB::bfn3');
                            inputState.value = await this.cmpClassB.bfn3(state.resetActionStart().value);
                        } else {
                            console.log('--> \\x1b[43mclassB::bfn3: 0 ms\\x1b[m <- ignored by condition');
                        }
                    `.normalizeSpace());
                });
            });

            describe('Collaboration with loop', () => {
                let data: any, parser: XmiParser;
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/collaboration');

                beforeEach((done) => {
                    parseString(fs.readFileSync('test/data/fixtures.xml'), (err: any, result: any) => { data = result; done(); });
                });

                beforeEach(() => {
                    parser = new XmiParser(data);
                    parser.parse();
                });

                it('check loop', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.1SimpleLoop.eaCollaboration1'));
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call componentA 
                        console.log('--> componentA::actionA1'); 
                        inputState.value = await this.cmpComponentA.actionA1(state.resetActionStart().value);
                    
                        // componentA call componentB 
                        console.log('--> componentB::actionB1'); 
                        inputState.value = await this.cmpComponentB.actionB1(state.resetActionStart().value);
                    
                        // componentA call componentB
                        inputState.value = await Promise.all(state.resetActionStart().value.map(async (x: any): Promise<any> => { 
                            // componentA call componentB
                            console.log('--> componentB::actionB2'); 
                            return await this.cmpComponentB.actionB2(x); 
                        }));`.normalizeSpace());
                });

                it('check loop with final call', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.2SimpleLoopWithFinalCall.eaCollaboration2'));
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call componentA
                        console.log('--> componentA::actionA1'); 
                        inputState.value = await this.cmpComponentA.actionA1(state.resetActionStart().value); 
                        
                        // componentA call componentB
                        inputState.value = await Promise.all(state.resetActionStart().value.map(async (x: any): Promise<any> => { 
                            // componentA call componentB 
                            console.log('--> componentB::actionB1'); 
                            return await this.cmpComponentB.actionB1(x); 
                        }));
                        
                        // componentA call componentB 
                        console.log('--> componentB::actionB2'); 
                        inputState.value = await this.cmpComponentB.actionB2(state.resetActionStart().value);
                    `.normalizeSpace());
                });
            });
        });
    });
});
