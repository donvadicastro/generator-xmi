import {readJSONSync} from "fs-extra";
import {XmiParser} from "generator-xmi-core";
import {xmiPackage} from "generator-xmi-core";
import {xmiClass} from "generator-xmi-core";
import '../../../common/tests/utils/normilize';
import {parseString} from "xml2js";
import * as fs from "fs";
import {xmiComponent} from "generator-xmi-core";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Component', () => {
                const dir = path.resolve(__dirname, '../../../../generators/nodejs/templates/partial/component');

                describe('Methods and conditions', () => {
                    let pkg, classes, classA: any;

                    beforeEach(async () => {
                        const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project11_activity_condition.json'));
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
                            return Promise.resolve(null);
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
                        parseString(fs.readFileSync(path.resolve(__dirname, '../../../../resources/models/fixtures.xml')), (err: any, result: any) => { data = result; done(); });
                    });

                    beforeEach(async () => {
                        parser = new XmiParser(data);
                        await parser.parse();
                    });

                    it('check method with single parameters', async () => {
                        const pkg = <xmiPackage>parser.packge;
                        const component: xmiComponent = <xmiComponent>(pkg.getNode('componentDiagrams.x1BasicComponents.notificationService'));
                        const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: component});

                        expect(content.normalizeSpace()).toBe(`
                       /**
                        * error action.
                        */
                        async error( message: string, ): Promise<void | null> {
                            return Promise.resolve(null);
                        }

                       /**
                        * info action.
                        */
                        async info( message: string, ): Promise<void | null> {
                            return Promise.resolve(null);
                        }
                    `.normalizeSpace());
                    });

                    it('check method with multiple parameters', async () => {
                        const pkg = <xmiPackage>parser.packge;
                        const component: xmiComponent = <xmiComponent>(pkg.getNode('componentDiagrams.x1BasicComponents.authService'));
                        const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: component});

                        expect(content.normalizeSpace()).toBe(`
                       /**
                        * login action.
                        */
                        async login(value: { username: string, password: string, }): Promise<boolean | null> {
                            return Promise.resolve(null);
                        }

                       /**
                        * logout action.
                        */
                        async logout(): Promise<void | null> {
                            return Promise.resolve(null);
                        }
                    `.normalizeSpace());
                    });
                });
            });
        });
    });
});
