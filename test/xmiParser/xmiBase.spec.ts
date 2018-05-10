import xmiBase from "../../src/entities/xmiBase";

describe('xmiBase', () => {
    it('constructor', () => {
        const base = new xmiBase({$: {'xmi:id': 'id1', 'xmi:type': 'type1', 'name': 'name1'}});

        expect('id1').toBe(base.id);
        expect('type1').toBe(base.type);
        expect('name1').toBe(base.name);
    });
});