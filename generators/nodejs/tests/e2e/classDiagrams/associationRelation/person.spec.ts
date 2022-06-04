import {getCheck} from "../../../../../common/tests/e2e/api/get.check";
import {postCheck} from "../../../../../common/tests/e2e/api/post.check";
import {putCheck} from "../../../../../common/tests/e2e/api/put.check";
import {deleteCheck} from "../../../../../common/tests/e2e/api/delete.check";

const request = require("supertest");

describe('nodejs generator E2E tests', () => {
    describe('x2-association-relation -> person', () => {
        describe('API server', () => {
            const API = request(process.env.NODE_API_URL);
            const rootPersonAPI = '/api/v1/class-diagrams/x2-association-relation/person';

            const createdActual = {firstName: "created-first-name", lastName: "created-last-name", addressRef: null};
            const updatedBefore = {firstName: "updated-before-first-name", lastName: "updated-before-last-name", addressRef: null};
            const updatedAfter = {firstName: "updated-after-first-name", lastName: "updated-after-last-name", addressRef: null};
            const deletedActual = {firstName: "deleted-first-name", lastName: "deleted-last-name", addressRef: null};

            getCheck(() => API, rootPersonAPI);
            postCheck(() => API, rootPersonAPI, createdActual);
            putCheck(() => API, rootPersonAPI, updatedBefore, updatedAfter);
            deleteCheck(() => API, rootPersonAPI, deletedActual);
        });

        describe('APP server', () => {
            const APP = request(process.env.NODE_APP_URL);

            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
});
