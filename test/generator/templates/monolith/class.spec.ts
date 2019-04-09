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
            describe('Class (input)', () => {
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/class');
                const data = readJSONSync('test/data/project11_activity_condition.json');
                const parser = new XmiParser(data);

                parser.parse();

                const pkg = <xmiPackage>parser.packge;
                const classes: xmiPackage = <xmiPackage>(<xmiPackage>pkg.children[0]).children[3];
                const classA = <xmiClass>classes.children[0];

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
        });
    });
});
