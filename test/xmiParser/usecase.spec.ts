import {readJSONSync} from "fs-extra";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {XmiParser} from "../../src/xmiParser";
import {xmiUseCase} from "../../src/entities/xmiUseCase";

xdescribe('xmiParser', () => {
    describe('UseCase', () => {
        const data = readJSONSync('test/data/project12_usecase.json');
        const parser = new XmiParser(data);

        beforeAll(async () => await parser.parse());

        it('Verify component structure', () => {
            const pkg = <xmiPackage>parser.packge;
            const entities = (<xmiPackage>(<xmiPackage>pkg.children[0]).children[4]).children;
            const useCase1 = <xmiUseCase>entities[0];
            expect(useCase1.name).toEqual("useCase1");
            expect(useCase1.description).toEqual("UseCase1 description");
            expect(useCase1.scenarios[0].steps).toEqual([ 'Action1', 'Action2', 'Action3' ]);

            const useCase2 = <xmiUseCase>entities[1];
            expect(useCase2.name).toEqual("useCase2");
            expect(useCase2.scenarios).toEqual([]);
        });
    });
});
