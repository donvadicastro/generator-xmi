import {readJSONSync} from "fs-extra";
import {XmiParser} from "generator-xmi-core";
import {xmiPackage} from "generator-xmi-core";
import {xmiComponent} from "generator-xmi-core";
import '../../../common/tests/utils/normilize';
import {xmiClass} from "generator-xmi-core";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Microservices', () => {
            describe('Interface', () => {
                const dir = path.resolve(__dirname, '../../../../generators/microservices/templates');
                const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project2_class.json'));
                const parser = new XmiParser(data);

                beforeEach(async () => await parser.parse());

                it('check generator', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const entities = (<xmiPackage>pkg.children[0]).children;
                    const c1: xmiClass = <xmiComponent>entities[4];
                    const content = await ejs.renderFile(path.join(dir, 'xmiInterface.ejs'), {entity: c1});

                    expect(content.normalizeSpace()).toBe(`
                        import {IMessageBase} from '../../../contracts/messages/baseMessage';

                        export interface BuildingMessage extends IMessageBase {
                            /**
                            * code property
                            */
                            code: number;
                        }
                    `.normalizeSpace());
                });
            });
        });
    });
});
