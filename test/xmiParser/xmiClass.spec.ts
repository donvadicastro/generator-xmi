import {xmiClass} from "../../src/entities/xmiClass";

describe('xmiClass', () => {
    it('constructor', () => {
        const cls = new xmiClass({$: {'name': 'name1', 'xmi:type': 'type1'}}, null);

        expect('name1').toBe(cls.name);
        expect('type1').toBe(cls.type);
    });
});