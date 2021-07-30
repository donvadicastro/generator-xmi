import {StartedTestContainer} from "testcontainers/dist/test-container";
import * as path from "path";
import {GenericContainer} from "testcontainers";
import anything = jasmine.anything;

const request = require('supertest');

describe('nodejs generator E2E tests', () => {
    let appContainer: StartedTestContainer;
    let postgresContainer: StartedTestContainer;

    beforeAll(async () => {
        jest.setTimeout(360000);

        postgresContainer = await new GenericContainer("postgres")
            .withExposedPorts(5432)
            .withEnv("POSTGRES_USER", "test")
            .withEnv("POSTGRES_PASSWORD", "test")
            .withEnv("POSTGRES_DB", "test")
            .start();

        const buildContainer = await GenericContainer.fromDockerfile(path.resolve('./test/generator/e2e'))
            .build();

        appContainer = await buildContainer
            .withCopyFileToContainer(path.resolve(__dirname, '../../../test/data/fixtures.xml'), "/generated/fixtures.xml")
            .withExposedPorts(3000, 4200)
            .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
            .start();
    });

    beforeAll(async () => {
        expect(await appContainer.exec(["yo", "--generators"]))
            .toEqual({exitCode: 0, output: 'Available Generators:\n\n  xmi\n    microservices\n    nodejs\n    spring\n    monolith\n'});

        expect(await appContainer.exec(["yo", "xmi", "fixtures.xml", "--type=nodejs", "--destination=."]))
            .toEqual({exitCode: 0, output: anything()});
    });

    describe('API server', () => {
        let req: any;

        beforeAll(async () => {
            await appContainer.exec(["npm", "run", "api:start:forever"]);
            req = request(`http://localhost:${appContainer.getMappedPort(3000)}`);
        });

        it('should start API server successfully', (done) => {
            req.get('/api-explorer').expect(200, done);
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

    describe('APP server', () => {
        beforeAll(async () => {
            await appContainer.exec(["npm", "run", "app:start:forever"]);
            await new Promise(x => setTimeout(x, 10000));
        });

        it('should start APP server successfully', (done) => {
            const req = request(`http://localhost:${appContainer.getMappedPort(4200)}`);
            req.get('/administration/classDiagrams/x1SimpleIndependentClasses/person').expect(200, done);
        });
    });
});
