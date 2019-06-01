import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";
import {xmiClass} from "../../src/entities/xmiClass";

describe('xmiClass', () => {
    it('constructor', () => {
        const cls = <xmiClass>xmiComponentFactory.get({$: {'xmi:type': 'uml:Class', 'name': 'name1'}});

        expect('name1').toBe(cls.name);
        expect('uml:Class').toBe(cls.type);
    });
});
