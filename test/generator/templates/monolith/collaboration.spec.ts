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
        describe('Microservices', () => {
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
                        flowAsync = flowAsync.then((state: any) => {
                            state.start = new Date();
                            console.log('--> classA::afn1');
                        
                            return this.cmpclassA.afn1(state);
                        });
                    
                        // classA call classB
                        flowAsync = flowAsync.then((state: any) => {
                            state.start = new Date();
                            console.log('--> classB::bfn1');
                        
                            return this.cmpclassB.bfn1(state);
                        });
                    
                        // classA call classB
                        flowAsync = flowAsync.then((state: any) => {
                            state.start = new Date();
                            
                            if(this.cmpclassA['a >= b'](state)) { 
                                console.log('--> classB::bfn2');
                                return this.cmpclassB.bfn2(state);
                            } else {
                                console.log('--> \\x1b[43mclassB::bfn2: 0 ms\\x1b[m <- ignored by condition');
                                return state;
                            }
                        });
                    
                        // classA call classB
                        flowAsync = flowAsync.then((state: any) => {
                            state.start = new Date();
                            
                            if(this.cmpclassA['a < b'](state)) { 
                                console.log('--> classB::bfn3');
                                return this.cmpclassB.bfn3(state);
                            } else {
                                console.log('--> \\x1b[43mclassB::bfn3: 0 ms\\x1b[m <- ignored by condition');
                                return state;
                            }
                        });
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
                        flowAsync = flowAsync.then((state: any) => { 
                            state.start = new Date(); 
                            console.log('--> componentA::actionA1'); 
                            
                            return this.cmpcomponentA.actionA1(state); 
                        }); 
                        
                        // componentA call componentB 
                        flowAsync = flowAsync.then((state: any) => { 
                            state.start = new Date(); 
                            console.log('--> componentB::actionB1'); 
                            
                            return this.cmpcomponentB.actionB1(state); 
                        }); 
                        
                        // componentA call componentB 
                        flowAsync = flowAsync.then((state: any) => { 
                            return Promise.resolve(state).then(state => { 
                                return Promise.all(state.returns.map(x => { 
                                    let flowAsync = Promise.resolve({...state, ...{returns: x}}); 
                                    
                                    // componentA call componentB 
                                    flowAsync = flowAsync.then((state: any) => { 
                                        state.start = new Date(); 
                                        console.log('--> componentB::actionB2'); 
                                        
                                        return this.cmpcomponentB.actionB2(state); 
                                    }); 
                                
                                    return flowAsync; 
                                })); 
                            }).then(states => state); 
                        });`.normalizeSpace());
                });

                it('check loop with final call', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.2SimpleLoopWithFinalCall.eaCollaboration2'));
                    const content = await ejs.renderFile(path.join(dir, 'flow.ejs'), {entity: sequence});

                    expect(content.normalizeSpace()).toBe(`
                        // Start call componentA 
                        flowAsync = flowAsync.then((state: any) => { 
                            state.start = new Date(); 
                            console.log('--> componentA::actionA1'); 
                            
                            return this.cmpcomponentA.actionA1(state); 
                        }); 
                        
                        // componentA call componentB 
                        flowAsync = flowAsync.then((state: any) => { 
                            return Promise.resolve(state).then(state => { 
                                return Promise.all(state.returns.map(x => { 
                                    let flowAsync = Promise.resolve({...state, ...{returns: x}}); 
                                    
                                    // componentA call componentB 
                                    flowAsync = flowAsync.then((state: any) => { 
                                        state.start = new Date(); 
                                        console.log('--> componentB::actionB1'); 
                                        
                                        return this.cmpcomponentB.actionB1(state); 
                                    }); 
                                
                                    return flowAsync; 
                                })); 
                            }).then(states => state);
                        });
                        
                        // componentA call componentB 
                        flowAsync = flowAsync.then((state: any) => { 
                            state.start = new Date(); 
                            console.log('--> componentB::actionB2'); 
                            
                            return this.cmpcomponentB.actionB2(state); 
                        });`.normalizeSpace());
                });
            });
        });
    });
});
