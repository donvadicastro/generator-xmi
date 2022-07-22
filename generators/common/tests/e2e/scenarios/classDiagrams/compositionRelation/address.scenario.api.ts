import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x3-composition-relation -> address', () => {
        const rootPersonAPI = '/api/v1/class-diagrams/x3-composition-relation/person';
        const rootAddressAPI = '/api/v1/class-diagrams/x3-composition-relation/address';

        describe('API server without child', () => {
            const createdActual = { city: "created-city", num: "created-last-name", street: "2022-07-21T20:40:40.718Z" };
            const updatedBefore = { city: "before-first-name", num: "before-last-name", street: "2021-07-21T20:40:40.718Z" };
            const updatedAfter = { city: "after-first-name", num: "after-last-name", street: "2020-07-21T20:40:40.718Z" };
            const deletedActual = { city: "delete-first-name", num: "delete-last-name", street: "2019-07-21T20:40:40.718Z" };

            describe('should support PUT method', () => {
                putCheck(() => API, rootAddressAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootAddressAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootAddressAPI, createdActual);
                });
            });
        })
    });
}
