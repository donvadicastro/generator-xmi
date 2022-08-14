import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x3-enums -> ticket', () => {
        describe('API server', () => {
            const rootTicketAPI = '/api/v1/class-structure/x3-enums/ticket';

            const invalid = { title: "created-title", type: "Invalid" };
            const createdActual = { title: "created-title", type: "BUG" };
            const updatedBefore = { title: "updated-before-title", type: "TASK" };
            const updatedAfter = { title: "updated-after-title", type: "BUG" };
            const deletedActual = { title: "created-title", type: "TASK" };

            describe('should support PUT method', () => {
                putCheck(() => API, rootTicketAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                deleteCheck(() => API, rootTicketAPI, () => deletedActual);
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootTicketAPI, createdActual);
                });
            });

            describe('should not allow custom value', () => {
                it('invalid', async () => {
                    let response = await API.post(rootTicketAPI).send(invalid);
                    // expect(response.body).toEqual({});
                    expect(response.status).not.toBe(201);
                });
            });
        });
    });
}
