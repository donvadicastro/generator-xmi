import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";

describe('xmiComponentFactory', () => {
    const factory = new xmiComponentFactory();

    it('Singleton', () => {
        expect(factory).toBeInstanceOf(xmiComponentFactory);
    });

    describe('Hash', () => {
        it('Empty by default', () => {
            expect(factory.idHash).toEqual({});
        });

        it('Should be added to hash', () => {
            const element = factory.get({$: {'name': 'name1', 'xmi:type': 'uml:Class', 'xmi:id': 'id1'}});
            expect(factory.getByKey('id1')).toBe(element);
            expect(factory.getByKey('id2')).toBeUndefined();
        });
    });
});
