import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> person', () => {
        describe('API server', () => {
            const rootPersonAPI = '/api/v1/class-diagrams/x2-association-relation/person';

            const createdActual = {firstName: "created-first-name", lastName: "created-last-name"};
            const updatedBefore = {
                firstName: "updated-before-first-name",
                lastName: "updated-before-last-name"
            };
            const updatedAfter = {
                firstName: "updated-after-first-name",
                lastName: "updated-after-last-name"
            };
            const deletedActual = {firstName: "deleted-first-name", lastName: "deleted-last-name"};

            putCheck(() => API, rootPersonAPI, updatedBefore, updatedAfter);
            deleteCheck(() => API, rootPersonAPI, deletedActual);

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootPersonAPI, createdActual);
                });
            });
        });
    });
}
