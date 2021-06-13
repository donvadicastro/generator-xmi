import {StartedTestContainer} from "testcontainers/dist/test-container";
import * as path from "path";
import {GenericContainer} from "testcontainers";

describe('nodejs generator E2E tests', () => {
    let container: StartedTestContainer;

    beforeAll(async () => {
        jest.setTimeout(240000);

        console.log('building image');
        const buildContainer = await GenericContainer.fromDockerfile(path.resolve('./test/generator/e2e'))
            .build();

        container = await buildContainer
            .withCopyFileToContainer(path.resolve(__dirname, '../../../test/data/fixtures.xml'), "/fixtures.xml")
            .start();
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
            await container.exec(["yo", "xmi", "data/fixtures.xml --type=nodejs"]);
            expect(await container.exec(["ls"])).toBe('');
        });
    });
});
