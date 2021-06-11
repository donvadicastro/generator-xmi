import {StartedTestContainer} from "testcontainers/dist/test-container";
import * as path from "path";
import {GenericContainer} from "testcontainers";

describe('nodejs generator E2E tests', () => {
    let container: StartedTestContainer;

    beforeAll(async () => {
        jest.setTimeout(240000);

        try {
            console.log('building image');
            const buildContainer = await GenericContainer.fromDockerfile(path.resolve('./test/generator/e2e'))
                .build();

            console.log('starting container');
            container = await buildContainer
                .withName('docker-xmi')
                .withCopyFileToContainer(path.resolve(__dirname, '../../../package.json'), "/package.json")
                // .withCopyFileToContainer(path.resolve(__dirname, '../../../generators'), "/generators")
                // .withCopyFileToContainer(path.resolve(__dirname, '../../../test/data'), "/data")
                .start();

            console.log('installing');
            console.log(await container.exec(["npm", "install"]));
        } catch (e) {
            console.log(e);
        }
    });

    // beforeAll(async () => {
    //     jest.setTimeout(1200000);
    //
    //     container = await new GenericContainer("outrigger/yeoman")
    //         .withName("xmi-nodejs")
    //         .withBindMount(path.resolve(__dirname, '../../../package.json'), "/generated/package.json")
    //         .withBindMount(path.resolve(__dirname, '../../../generators'), "/generated/generators")
    //         .withBindMount(path.resolve(__dirname, '../../../test/data'), "/generated/data")
    //         .start();
    // });
    //
    // beforeAll(async () => {
    //     await container.exec(["npm", "install"]);
    //     //await container.exec(["npm", "link"]);
    // });

    afterAll(async () => {
        await container.stop();
    });

    describe('API server', () => {
        it('should generate successfully', async () => {
            expect(await container.exec(["ls"])).toBe("")
            //expect(await container.exec(["yo", "xmi", "data/fixtures.xml --type=nodejs"])).toBe('');
        });
    });
});
