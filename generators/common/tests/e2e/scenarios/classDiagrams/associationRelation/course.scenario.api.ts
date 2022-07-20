import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> course', () => {
        const rootCourseAPI = '/api/v1/class-diagrams/x2-association-relation/cource';
        const rootStudentAPI = '/api/v1/class-diagrams/x2-association-relation/student';

        xdescribe('API server with child', () => {
            const createdActual = { name: "created-first-name",
                studentRefList: [{firstName: "create-student-first1", lastName: "create-student-last1"}, {firstName: "create-student-first2", lastName: "create-student-last2"}] };

            const updatedBefore = { name: "before-first-name",
                studentRefList: [{firstName: "before-student-first1", lastName: "before-student-last1"}, {firstName: "before-student-first2", lastName: "before-student-last2"}] };

            const updatedAfter = { name: "after-first-name",
                studentRefList: [{firstName: "after-student-first3", lastName: "after-student-last3"}] };

            const deletedActual = { name: "delete-first-name",
                studentRefList: [{firstName: "delete-student-first1", lastName: "delete-student-last1"}] };

            describe('should support PUT method', () => {
                putCheck(() => API, rootCourseAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootCourseAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootCourseAPI, createdActual);
                });
            });
        });

        describe('API server without child', () => {
            const createdActual = { name: "created-name" };
            const updatedBefore = { name: "before-name" };
            const updatedAfter = { name: "after-name" };
            const deletedActual = { name: "delete-name" };

            describe('should support PUT method', () => {
                putCheck(() => API, rootCourseAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootCourseAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootCourseAPI, createdActual);
                });
            });
        });

        describe('Student <-> Course link', () => {
            it('Course can be created with link to student', async () => {
                let courseToLink: any = { name: "course-to-link" };

                // check create
                let studentToLinkForCreate: any = { firstName: "student-to-link-create-first", lastName: "student-to-link-create-last" };
                studentToLinkForCreate.id = await postCheck(API, rootStudentAPI, studentToLinkForCreate);
                courseToLink.id = await postCheck(API, rootCourseAPI, { ...courseToLink, studentRefList: [studentToLinkForCreate] });

                // check update
                let studentToLinkForUpdate: any = { firstName: "student-to-link-update-first", lastName: "student-to-link-update-last" };
                studentToLinkForUpdate.id = await postCheck(API, rootStudentAPI, studentToLinkForUpdate);

                const updated = { ...courseToLink, studentRefList: [studentToLinkForUpdate] };
                let response = await API.put(`${rootCourseAPI}/${courseToLink.id}`).send(updated).expect(200);
                expect(response.body).toEqual(updated);
            });
        });
    });
}
