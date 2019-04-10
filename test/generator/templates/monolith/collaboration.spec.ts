import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiComponent} from "../../../../src/entities/xmiComponent";
import '../../../../utils/normilize';
import {xmiClass} from "../../../../src/entities/xmiClass";
import {xmiCollaboration} from "../../../../src/entities/xmiCollaboration";

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
                                console.log('--> classB::bfn2 -> ignore by condition');
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
                                console.log('--> classB::bfn3 -> ignore by condition');
                                return state;
                            }
                        });
                    `.normalizeSpace());
                });
            });
        });
    });
});
