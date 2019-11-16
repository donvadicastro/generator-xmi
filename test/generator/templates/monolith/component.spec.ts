import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiClass} from "../../../../src/entities/xmiClass";
import '../../../../utils/normilize';

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Component', () => {
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/component');

                it('check conditions', async () => {
                    const data = readJSONSync('test/data/project11_activity_condition.json');
                    const parser = new XmiParser(data);

                    parser.parse();

                    const pkg = <xmiPackage>parser.packge;
                    const classes: xmiPackage = <xmiPackage>(<xmiPackage>pkg.children[0]).children[3];
                    const classA = <xmiClass>classes.children[0];
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
