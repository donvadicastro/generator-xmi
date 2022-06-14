import {postCheck} from "../../../../../common/tests/e2e/api/post.check";
import {putCheck} from "../../../../../common/tests/e2e/api/put.check";
import {deleteCheck} from "../../../../../common/tests/e2e/api/delete.check";

const request = require("supertest");

xdescribe('nodejs generator E2E tests', () => {
    describe('x1-simple-independent-classes -> person', () => {
        describe('API server', () => {
            const API = request(process.env.NODE_API_URL);
            const rootPersonAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/person';

            const address = { address: "addressInfo", city: "cityInfo", country: "countryInfo", postCode: 1 };
            const createdActual = {fisrtName: "created-first-name", lastName: "created-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedBefore = {fisrtName: "updated-before-first-name", lastName: "updated-before-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};
            const updatedAfter = {fisrtName: "updated-after-first-name", lastName: "updated-after-last-name", birthdate: "2022-07-01T19:41:16.357Z", address: address};
            const deletedActual = {fisrtName: "deleted-first-name", lastName: "deleted-last-name", birthdate: "2022-06-01T19:41:16.357Z", address: address};

            putCheck(() => API, rootPersonAPI, updatedBefore, updatedAfter);
            deleteCheck(() => API, rootPersonAPI, deletedActual);

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootPersonAPI, createdActual);
                });
            });
        });

        describe('APP server', () => {
            const APP = request(process.env.NODE_APP_URL);

            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
});
