import {xmiAttribute} from "../../src/entities/class/xmiAttribute";
import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";

describe('xmiAttribute', () => {
    it('constructor', () => {
        const attribute = new xmiAttribute({$: {'name': 'name1'}, properties: [{$: {type: 'type1'}}]}, null, new xmiComponentFactory('js'));

        expect('name1').toBe(attribute.name);
        expect('type1').toBe(attribute.type);
    });
});
