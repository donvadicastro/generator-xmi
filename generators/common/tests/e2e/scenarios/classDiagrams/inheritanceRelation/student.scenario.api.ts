import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x5-inheritance-relation -> student', () => {
        describe('API server', () => {
            const rootStudentAPI = '/api/v1/class-diagrams/x5-inheritance-relation/student';

            const createdActual = {
                firstName: "created-first-name",
                lastName: "created-last-name",
                cource: 1
            };
            const updatedBefore = {
                firstName: "updated-before-first-name",
                lastName: "updated-before-last-name",
                cource: 2
            };
            const updatedAfter = {
                firstName: "updated-after-first-name",
                lastName: "updated-after-last-name",
                cource: 3
            };
            const deletedActual = {
                firstName: "deleted-first-name",
                lastName: "deleted-last-name",
                cource: 4
            };

            describe('should support PUT method', () => {
                putCheck(() => API, rootStudentAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootStudentAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootStudentAPI, createdActual);
                });
            });
        });
    });
}
