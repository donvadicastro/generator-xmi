import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x1-simple-independent-classes -> person', () => {
        describe('API server', () => {
            const rootPersonAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/person';

            const address = {address: "addressInfo", city: "cityInfo", country: "countryInfo", postCode: 1};
            const createdActual = {
                fisrtName: "created-first-name",
                lastName: "created-last-name",
                birthdate: "2022-06-01T19:41:16.357Z",
                address: address
            };
            const updatedBefore = {
                fisrtName: "updated-before-first-name",
                lastName: "updated-before-last-name",
                birthdate: "2022-06-01T19:41:16.357Z",
                address: address
            };
            const updatedAfter = {
                fisrtName: "updated-after-first-name",
                lastName: "updated-after-last-name",
                birthdate: "2022-07-01T19:41:16.357Z",
                address: address
            };
            const deletedActual = {
                fisrtName: "deleted-first-name",
                lastName: "deleted-last-name",
                birthdate: "2022-06-01T19:41:16.357Z",
                address: address
            };

            describe('should support PUT method', () => {
                putCheck(() => API, rootPersonAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootPersonAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootPersonAPI, createdActual);
                });
            });
        });
    });
}
