import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> student', () => {
        const rootStudentAPI = '/api/v1/class-diagrams/x2-association-relation/student';
        const rootCourseAPI = '/api/v1/class-diagrams/x2-association-relation/cource';

        xdescribe('API server with child', () => {
            const createdActual = { firstName: "created-first-name", lastName: "created-last-name",
                courceRefList: [{name: "create-course1"}, {name: "create-course2"}] };

            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name",
                courceRefList: [{name: "before-course1"}, {name: "before-course2"}] };

            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name",
                courceRefList: [{name: "after-course3"}] };

            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name",
                courceRefList: [{name: "delete-course3"}] };

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

        describe('API server without child', () => {
            const createdActual = { firstName: "created-first-name", lastName: "created-last-name" };
            const updatedBefore = { firstName: "before-first-name", lastName: "before-last-name" };
            const updatedAfter = { firstName: "after-first-name", lastName: "after-last-name" };
            const deletedActual = { firstName: "delete-first-name", lastName: "delete-last-name" };

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

        describe('Student <-> Course link', () => {
            it('Student can be created with link to course', async () => {
                let studentToLink: any = { firstName: "student-first-to-link", lastName: "student-last-to-link" };

                // check create
                let courseToLinkForCreate: any = { name: "course-to-link-create-first" };
                courseToLinkForCreate.id = await postCheck(API, rootCourseAPI, courseToLinkForCreate);
                studentToLink.id = await postCheck(API, rootStudentAPI, { ...studentToLink, courceRefList: [courseToLinkForCreate] });

                // check update
                let courseToLinkForUpdate: any = { name: "course-to-link-update-first" };
                courseToLinkForUpdate.id = await postCheck(API, rootCourseAPI, courseToLinkForUpdate);

                const updated = { ...studentToLink, courceRefList: [courseToLinkForUpdate] };
                let response = await API.put(`${rootStudentAPI}/${studentToLink.id}`).send(updated).expect(200);
                expect(response.body).toMatchObject(updated);
            });
        });
    });
}
