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
    describe('x1-simple-independent-classes -> person', () => {
        describe('API server', () => {
            let req: any;

            const rootPersonAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/person';

            const address = { address: "addressInfo", city: "cityInfo", country: "countryInfo", postCode: 1 };
            const createdActual = {fisrtName: "created-first-name", lastName: "created-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const createdExpected = {id: 1, fisrtName: "created-first-name", lastName: "created-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedBefore = {fisrtName: "updated-before-first-name", lastName: "updated-before-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedAfter = {fisrtName: "updated-after-first-name", lastName: "updated-after-last-name", birthdate: "2022-07-01T19:41:16.357Z", address: address};
            const deletedActual = {fisrtName: "deleted-first-name", lastName: "deleted-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};

            beforeAll(async () => {
                req = request(`http://localhost:${globalThis.containers.api.getMappedPort(3000)}`);
            });

            it('should start API server successfully', async () => {
                await req.get('/').expect(200);
            });

            getCheck(() => req, rootPersonAPI);
            postCheck(() => req, rootPersonAPI, createdActual, createdExpected);
            putCheck(() => req, rootPersonAPI, updatedBefore, updatedAfter);
            deleteCheck(() => req, rootPersonAPI, deletedActual);
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
