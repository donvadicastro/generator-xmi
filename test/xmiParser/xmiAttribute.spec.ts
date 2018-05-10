import {xmiAttribute} from "../../src/entities/class/xmiAttribute";

describe('xmiAttribute', () => {
    it('constructor', () => {
        const attribute = new xmiAttribute({$: {'name': 'name1'}, properties: [{$: {type: 'type1'}}]});

        expect('name1').toBe(attribute.name);
        expect('type1').toBe(attribute.type);
    });
});