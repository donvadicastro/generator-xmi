import {xmiActor} from "../src";
import {xmiComponentFactory} from "../src";

describe('xmiActor', () => {
    const factory = new xmiComponentFactory('js');

    it('constructor', () => {
        const actor = <xmiActor>factory.get({$: {'xmi:type': 'uml:Actor', 'xmi:id': 'id1', 'name': 'name1'}});

        expect('id1').toBe(actor.id);
        expect('uml:Actor').toBe(actor.type);
        expect('name1').toBe(actor.name);
    });
});
