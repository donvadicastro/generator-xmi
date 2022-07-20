import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> student', () => {
        xdescribe('API server with child', () => {
            const rootAirplaneAPI = '/api/v1/class-diagrams/x2-association-relation/student';

            const createdActual = { firstName: "created-first-name", lastName: "created-last-name",
                courceRefList: [{name: "create-course1"}, {name: "create-course2"}] };

            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name",
                courceRefList: [{name: "before-course1"}, {name: "before-course2"}] };

            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name",
                courceRefList: [{name: "after-course3"}] };

            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name",
                courceRefList: [{name: "delete-course3"}] };

            describe('should support PUT method', () => {
                putCheck(() => API, rootAirplaneAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootAirplaneAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootAirplaneAPI, createdActual);
                });
            });
        });

        describe('API server without child', () => {
            const rootAirplaneAPI = '/api/v1/class-diagrams/x2-association-relation/student';

            const createdActual = { firstName: "created-first-name", lastName: "created-last-name" };
            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name" };
            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name" };
            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name" };

            describe('should support PUT method', () => {
                putCheck(() => API, rootAirplaneAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootAirplaneAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootAirplaneAPI, createdActual);
                });
            });
        })
    });
}
