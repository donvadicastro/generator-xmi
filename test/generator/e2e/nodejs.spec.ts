import {StartedTestContainer} from "testcontainers/dist/test-container";
import * as path from "path";
import {GenericContainer} from "testcontainers";

describe('nodejs generator E2E tests', () => {
    let container: StartedTestContainer;

    beforeAll((done) => {
        jest.setTimeout(300_000);

        console.log('building image');
        GenericContainer.fromDockerfile(path.resolve('./test/generator/e2e')).build().then(x => {
            console.log('starting image');
            return x.withBindMount(path.resolve(__dirname, '../../../test/data'), "/generated/data").start();
        }).then(x => {
            console.log('started', x.getName());
            container = x;

            done();
        });
    });

    // beforeAll(async () => {
    //     jest.setTimeout(1200000);
    //
    //     container = await new GenericContainer("node:alpine")
    //         .withName("xmi-nodejs")
    //         .withBindMount(path.resolve(__dirname, '../../../package.json'), "/package.json")
    //         .withBindMount(path.resolve(__dirname, '../../../generators'), "/generators")
    //         .withBindMount(path.resolve(__dirname, '../../../node_modules'), "/node_modules")
    //         .withBindMount(path.resolve(__dirname, '../../../src'), "/src")
    //         .withBindMount(path.resolve(__dirname, '../../../test/data'), "/data")
    //         .withCmd(["tail", "-f", "/dev/null"])
    //         .start();
    //
    //     await container.exec(["npm", "install", "yo", "rimraf", "--global"]);
    //     await container.exec(["npm", "link"]);
    //     await container.exec(["bash", "-c", "'chmod g+rwx /root /root/.config /root/.config/insight-nodejs'"]);
    // });

    // beforeAll(async () => {
    //     // await container.exec(["npm", "install"]);
    //     await container.exec(["npm", "link"]);
    //     await container.exec(["tail", "-f", "/dev/null"]); //to keep running
    // });

    afterAll(async () => {
        await container.stop();
    });

    describe('API server', () => {
        it('should generate successfully', (done) => {
            container.exec(["yo", "xmi", "data/fixtures.xml", "--type=nodejs"])
                .then(x => container.exec(["ls"]))
                .then(x => {
                    expect(x).toEqual({ "exitCode": 0, "output": "data\ndist\n" });
                    done();
                });
        });
    });
});
