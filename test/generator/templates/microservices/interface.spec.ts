import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiComponent} from "../../../../src/entities/xmiComponent";
import '../../../../utils/normilize';
import {xmiClass} from "../../../../src/entities/xmiClass";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Microservices', () => {
            describe('Interface', () => {
                const dir = path.join(__dirname, '../../../../generators/microservices/templates');
                const data = readJSONSync('test/data/project2_class.json');
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
