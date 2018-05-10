import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";

describe('xmiComponentFactory', () => {
    it('Singleton', () => {
        expect(xmiComponentFactory.instance).toBeInstanceOf(xmiComponentFactory);
    });

    describe('Hash', () => {
        it('Empty by default', () => {
            expect(xmiComponentFactory.instance.idHash).toEqual({});
        });

        it('Should be added to hash', () => {
            const element = xmiComponentFactory.get({$: {'name': 'name1', 'xmi:type': 'uml:Class', 'xmi:id': 'id1'}});
            expect(xmiComponentFactory.getByKey('id1')).toBe(element);
            expect(xmiComponentFactory.getByKey('id2')).toBeUndefined();
        });
    });
});