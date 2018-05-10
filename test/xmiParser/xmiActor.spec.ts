import {xmiActor} from "../../src/entities/xmiActor";

describe('xmiActor', () => {
    it('constructor', () => {
        const actor = new xmiActor({$: {'xmi:id': 'id1', 'xmi:type': 'type1', 'name': 'name1'}});

        expect('id1').toBe(actor.id);
        expect('type1').toBe(actor.type);
        expect('name1').toBe(actor.name);
    });
});