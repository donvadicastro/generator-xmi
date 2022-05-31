import {StartedTestContainer} from "testcontainers/dist/test-container";
import {GenericContainer} from "testcontainers";

import * as request from 'supertest';

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

        describe('x1-simple-independent-classes -> vehicle', () => {
            const rootVehicleAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/vehicle';

            describe('should support GET method', () => {
                it('existing', async () => {
                    await req.get(rootVehicleAPI).expect(200);
                });

                it('not found', async () => {
                    await req.get(`${rootVehicleAPI}/0`).expect(404);
                });
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    let expected = { id: 1, name: "string", serial: 0 };

                    let response = await req.post(rootVehicleAPI).send({ name: "string", serial: 0 }).expect(201);
                    expect(response.body).toEqual(expected);

                    response = await req.get(`${rootVehicleAPI}/1`).expect(200);
                    expect(response.body).toEqual({ id: 1, name: "string", serial: 0 });
                });
            });

            describe('should support PUT method', () => {
                let id = 0;

                beforeAll(async () => {
                    let response = await req.post(rootVehicleAPI).send({ name: "created-for-update", serial: 1 }).expect(201);
                    id = response.body.id;
                });

                it('updated', async () => {
                    let actual = { name: "updated", serial: 2 };
                    let expected = { id: id, ...actual };

                    let response = await req.put(`${rootVehicleAPI}/${id}`).send(actual).expect(200);
                    expect(response.body).toEqual(expected);

                    response = await req.get(`${rootVehicleAPI}/${id}`).expect(200);
                    expect(response.body).toEqual(expected);
                });
            });

            describe('should support DELETE method', () => {
                let id = 0;

                beforeAll(async () => {
                    let response = await req.post(rootVehicleAPI).send({ name: "created-for-delete", serial: 1 }).expect(201);
                    id = response.body.id;
                });

                it('deleted', async () => {
                    await req.delete(`${rootVehicleAPI}/${id}`).expect(200);
                    await req.get(`${rootVehicleAPI}/${id}`).expect(404);

                    // second time to delete
                    await req.delete(`${rootVehicleAPI}/${id}`).expect(404);
                });

                it('not found', async () => {
                    await req.get(`${rootVehicleAPI}/99999`).expect(404);
                });
            });
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
