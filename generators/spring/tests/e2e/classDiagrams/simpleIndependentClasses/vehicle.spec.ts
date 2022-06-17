import {postCheck} from "../../../../../common/tests/e2e/api/post.check";
import {putCheck} from "../../../../../common/tests/e2e/api/put.check";
import {deleteCheck} from "../../../../../common/tests/e2e/api/delete.check";

const request = require("supertest");

describe('nodejs generator E2E tests', () => {
    describe('x1-simple-independent-classes -> vehicle', () => {
        describe('API server', () => {
            const API = request(process.env.SPRING_API_URL);
            const rootVehicleAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/vehicle';

            const createdActual = {name: "created-check", serial: 0};
            const updatedBefore = {name: "updated-check", serial: 1};
            const updatedAfter = {name: "updated", serial: 2};
            const deletedActual = {name: "deleted-check", serial: 1};

            putCheck(() => API, rootVehicleAPI, updatedBefore, updatedAfter);
            deleteCheck(() => API, rootVehicleAPI, deletedActual);

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootVehicleAPI, createdActual);
                });
            });
        });

        xdescribe('APP server', () => {
            const APP = request(process.env.NODE_APP_URL);

            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
});
