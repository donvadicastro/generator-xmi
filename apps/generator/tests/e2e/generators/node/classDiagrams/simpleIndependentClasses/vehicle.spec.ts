/**
 * @jest-environment ./tests/e2e/environments/node-environment
 */

import * as request from 'supertest';
import {getCheck} from "../../../../api/get.check";
import {postCheck} from "../../../../api/post.check";
import {putCheck} from "../../../../api/put.check";
import {deleteCheck} from "../../../../api/delete.check";

jest.useRealTimers();
jest.setTimeout(1200_000);

describe('nodejs generator E2E tests', () => {
    describe('x1-simple-independent-classes -> vehicle', () => {
        describe('API server', () => {
            let req: any;

            const rootVehicleAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/vehicle';

            const createdActual = {name: "created-check", serial: 0};
            const createdExpected = {id: 1, name: "created-check", serial: 0};
            const updatedBefore = {name: "updated-check", serial: 1};
            const updatedAfter = {name: "updated", serial: 2};
            const deletedActual = {name: "deleted-check", serial: 1};

            beforeAll(async () => {
                req = request(`http://localhost:${globalThis.containers.api.getMappedPort(3000)}`);
            });

            it('should start API server successfully', async () => {
                await req.get('/').expect(200);
            });

            getCheck(() => req, rootVehicleAPI);
            postCheck(() => req, rootVehicleAPI, createdActual, createdExpected);
            putCheck(() => req, rootVehicleAPI, updatedBefore, updatedAfter);
            deleteCheck(() => req, rootVehicleAPI, deletedActual);
        });

        describe('APP server', () => {
            beforeAll(async () => {
                await new Promise(x => setTimeout(x, 10000));
            });

            it('should start APP server successfully', async () => {
                const req = request(`http://localhost:${globalThis.containers.app.getMappedPort(4200)}`);
                await req.get('/').expect(200);
            });
        });
    });
});
