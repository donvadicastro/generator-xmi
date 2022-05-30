import {xmiComponentFactory} from "../src";
import {xmiClass} from "../src";

describe('xmiClass', () => {
    it('constructor', () => {
        const cls = <xmiClass>new xmiComponentFactory('js').get({$: {'xmi:type': 'uml:Class', 'name': 'name1'}});

        expect('name1').toBe(cls.name);
        expect('uml:Class').toBe(cls.type);
    });
});
