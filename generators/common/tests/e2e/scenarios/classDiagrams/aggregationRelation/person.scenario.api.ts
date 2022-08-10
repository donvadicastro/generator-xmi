import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x4-aggregation-relation -> person', () => {
        const rootPersonAPI = '/api/v1/class-diagrams/x4-aggregation-relation/person';

        describe('API server without child', () => {
            const createdActual = { firstName: "created-first-name", lastName: "created-last-name" };
            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name" };
            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name" };
            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name" };

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
