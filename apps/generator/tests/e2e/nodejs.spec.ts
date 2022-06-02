import {StartedTestContainer} from "testcontainers/dist/test-container";
import {GenericContainer} from "testcontainers";

import * as request from 'supertest';
import {getCheck} from "./api/get.check";
import {postCheck} from "./api/post.check";
import {putCheck} from "./api/put.check";
import {deleteCheck} from "./api/delete.check";

jest.useRealTimers();
jest.setTimeout(1200_000);

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

        apiContainer = await new GenericContainer("generator-xmi-runner-node")
            .withExposedPorts(3000)
            .withCmd(["npm", "run", "api:start"])
            .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
            .start();

        appContainer = await new GenericContainer("generator-xmi-runner-node")
            .withExposedPorts(4200)
            .withCmd(["npm", "run", "app:start"])
            .start();
    });

    describe('API server', () => {
        let req: any;

        beforeAll(async () => {
            req = request(`http://localhost:${apiContainer.getMappedPort(3000)}`);
            await new Promise((resolve) => setTimeout(resolve, 10000));
        });

        it('should start API server successfully', async () => {
            await req.get('/').expect(200);
        });

        describe('x1-simple-independent-classes -> person', () => {
            const rootPersonAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/person';

            const address = { address: "addressInfo", city: "cityInfo", country: "countryInfo", postCode: 1 };
            const createdActual = {fisrtName: "created-first-name", lastName: "created-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const createdExpected = {id: 1, fisrtName: "created-first-name", lastName: "created-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedBefore = {fisrtName: "updated-before-first-name", lastName: "updated-before-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedAfter = {fisrtName: "updated-after-first-name", lastName: "updated-after-last-name", birthdate: "2022-07-01T19:41:16.357Z", address: address};
            const deletedActual = {fisrtName: "deleted-first-name", lastName: "deleted-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};

            getCheck(() => req, rootPersonAPI);
            postCheck(() => req, rootPersonAPI, createdActual, createdExpected);
            putCheck(() => req, rootPersonAPI, updatedBefore, updatedAfter);
            deleteCheck(() => req, rootPersonAPI, deletedActual);
        });

        describe('x1-simple-independent-classes -> vehicle', () => {
            const rootVehicleAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/vehicle';

            const createdActual = {name: "created-check", serial: 0};
            const createdExpected = {id: 1, name: "created-check", serial: 0};
            const updatedBefore = {name: "updated-check", serial: 1};
            const updatedAfter = {name: "updated", serial: 2};
            const deletedActual = {name: "deleted-check", serial: 1};

            getCheck(() => req, rootVehicleAPI);
            postCheck(() => req, rootVehicleAPI, createdActual, createdExpected);
            putCheck(() => req, rootVehicleAPI, updatedBefore, updatedAfter);
            deleteCheck(() => req, rootVehicleAPI, deletedActual);
        });
    });

    describe('APP server', () => {
        beforeAll(async () => {
            await new Promise(x => setTimeout(x, 10000));
        });

        it('should start APP server successfully', async () => {
            const req = request(`http://localhost:${appContainer.getMappedPort(4200)}`);
            await req.get('/').expect(200);
        });
    });
});
