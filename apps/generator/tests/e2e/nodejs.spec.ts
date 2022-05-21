import {StartedTestContainer} from "testcontainers/dist/test-container";
import * as path from "path";
import {GenericContainer} from "testcontainers";

const request = require('supertest');

jest.useRealTimers();
jest.setTimeout(600_000);

describe('nodejs generator E2E tests', () => {
    let postgresContainer: StartedTestContainer;
    let apiContainer: StartedTestContainer;
    let appContainer: StartedTestContainer;

    beforeAll(async () => {
        postgresContainer = await new GenericContainer("postgres")
            .withExposedPorts(5432)
            .withEnv("POSTGRES_USER", "test")
            .withEnv("POSTGRES_PASSWORD", "test")
            .withEnv("POSTGRES_DB", "test")
            .start();

        const buildContainer = await GenericContainer.fromDockerfile(path.resolve('./'))
            .withBuildArg("GENERATOR_TYPE", "nodejs")
            .build("generator-xmi-runner");

        apiContainer = await buildContainer
            .withExposedPorts(3000)
            .withCmd(["npm", "run", "api:start"])
            .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
            .start();

        appContainer = await buildContainer
            .withExposedPorts(4200)
            .withCmd(["npm", "run", "app:start"])
            .start();
    });

    // beforeAll(async () => {
    //     expect(await appContainer.exec(["yo", "--generators"]))
    //         .toEqual({exitCode: 0, output: 'Available Generators:\n\n  xmi\n    microservices\n    nodejs\n    spring\n    monolith\n'});
    //
    //     expect(await appContainer.exec(["yo", "xmi", "fixtures.xml", "--type=nodejs", "--destination=."]))
    //         .toEqual({exitCode: 0, output: anything()});
    // });

    describe('API server', () => {
        let req: any;

        beforeAll(async () => {
            req = request(`http://localhost:${apiContainer.getMappedPort(3000)}`);
            await new Promise((resolve) => setTimeout(resolve, 10000));
        });

        it('should start API server successfully', (done) => {
            req.get('/').expect(200, done);
        });

        describe('x1-simple-independent-classes -> vehicle', () => {
            describe('should support GET method', () => {
                it('existing', (done) => {
                    req.get('/api/v1/class-diagrams/x1-simple-independent-classes/vehicle').expect(200, done);
                });

                it('not found', (done) => {
                    req.get('/api/v1/class-diagrams/x1-simple-independent-classes/vehicle/0').expect(404, done);
                });
            });

            it('should support POST method', () => {
            });
        });
    });

    xdescribe('APP server', () => {
        beforeAll(async () => {
            await new Promise(x => setTimeout(x, 10000));
        });

        it('should start APP server successfully', (done) => {
            const req = request(`http://localhost:${appContainer.getMappedPort(4200)}`);
            req.get('/').expect(200, done);
        });
    });
});
