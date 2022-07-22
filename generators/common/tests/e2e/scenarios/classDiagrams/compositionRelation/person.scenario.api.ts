import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x3-composition-relation -> person', () => {
        const rootPersonAPI = '/api/v1/class-diagrams/x3-composition-relation/person';
        const rootAddressAPI = '/api/v1/class-diagrams/x3-composition-relation/address';

        describe('API server without child', () => {
            const createdActual = { firstName: "created-first-name", lastName: "created-last-name", birthday: "2022-07-21T20:40:40.718Z" };
            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name", birthday: "2021-07-21T20:40:40.718Z" };
            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name", birthday: "2020-07-21T20:40:40.718Z" };
            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name", birthday: "2019-07-21T20:40:40.718Z" };

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
        })
    });
}
