import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiClass} from "../../../../src/entities/xmiClass";
import '../../../../utils/normilize';
import {parseString} from "xml2js";
import fs from "fs";
import {xmiCollaboration} from "../../../../src/entities/xmiCollaboration";
import {xmiComponent} from "../../../../src/entities/xmiComponent";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Component', () => {
                const dir = path.join(__dirname, '../../../../generators/nodejs/templates/partial/component');

                describe('Methods and conditions', () => {
                    let pkg, classes, classA: any;

                    beforeEach(async () => {
                        const data = readJSONSync('test/data/project11_activity_condition.json');
                        const parser = new XmiParser(data);
                        await parser.parse();

                        pkg = <xmiPackage>parser.packge;
                        classes = <xmiPackage>(<xmiPackage>pkg.children[0]).children[3];
                        classA = <xmiClass>classes.children[0];
                    });

                    it('check methods', async () => {
                        const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: classA});

                        expect(content.normalizeSpace()).toBe(`
                        /** 
                         * afn1 action. 
                        */ 
                        async afn1(): Promise<void | null> { 
                            return null; 
                        }
                    `.normalizeSpace());
                    });

                    it('check conditions', async () => {
                        const content = await ejs.renderFile(path.join(dir, 'conditions.ejs'), {entity: classA});

                        expect(content.normalizeSpace()).toBe(`
                        //# region Message conditions
                        'a >= b'(state: any) {
                            return true;
                        }
                        
                        'a < b'(state: any) {
                            return true;
                        }
                        //# endregion
                    `.normalizeSpace());
                    });
                });

                describe('Methods with single and multiple parameters', () => {
                    let data: any, parser: XmiParser;

                    beforeEach((done) => {
                        parseString(fs.readFileSync('test/data/fixtures.xml'), (err: any, result: any) => { data = result; done(); });
                    });

                    beforeEach(async () => {
                        parser = new XmiParser(data);
                        await parser.parse();
                    });

                    it('check method with single parameters', async () => {
                        const pkg = <xmiPackage>parser.packge;
                        const component: xmiComponent = <xmiComponent>(pkg.getNode('componentDiagrams.1BasicComponents.notificationService'));
                        const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: component});

                        expect(content.normalizeSpace()).toBe(`
                       /** 
                        * error action.
                        */ 
                        async error( message: string, ): Promise<void | null> { 
                            return null; 
                        }
                        
                       /** 
                        * info action.
                        */ 
                        async info( message: string, ): Promise<void | null> { 
                            return null; 
                        }
                    `.normalizeSpace());
                    });

                    it('check method with multiple parameters', async () => {
                        const pkg = <xmiPackage>parser.packge;
                        const component: xmiComponent = <xmiComponent>(pkg.getNode('componentDiagrams.1BasicComponents.authService'));
                        const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: component});

                        expect(content.normalizeSpace()).toBe(`
                       /** 
                        * login action.
                        */ 
                        async login(value: { username: string, password: string, }): Promise<boolean | null> { 
                            return null; 
                        }
                        
                       /** 
                        * logout action.
                        */ 
                        async logout(): Promise<void | null> { 
                            return null; 
                        }
                    `.normalizeSpace());
                    });
                });
            });
        });
    });
});
