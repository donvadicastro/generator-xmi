import {xmiActor} from "../../src/entities/xmiActor";
import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";

describe('xmiActor', () => {
    it('constructor', () => {
        const actor = <xmiActor>xmiComponentFactory.get({$: {'xmi:type': 'uml:Actor', 'xmi:id': 'id1', 'name': 'name1'}});

        expect('id1').toBe(actor.id);
        expect('uml:Actor').toBe(actor.type);
        expect('name1').toBe(actor.name);
    });
});
