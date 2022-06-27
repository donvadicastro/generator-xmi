import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x1-simple-independent-classes -> vehicle', () => {
        describe('API server', () => {
            const rootVehicleAPI = '/api/v1/class-diagrams/x1-simple-independent-classes/vehicle';

            const createdActual = {name: "created-check", serial: 0};
            const updatedBefore = {name: "updated-check", serial: 1};
            const updatedAfter = {name: "updated", serial: 2};
            const deletedActual = {name: "deleted-check", serial: 1};

            putCheck(() => API, rootVehicleAPI, updatedBefore, updatedAfter);
            deleteCheck(() => API, rootVehicleAPI, deletedActual);

            describe('should support POST method', () => {
                it('created', async () => {
                    await postCheck(API, rootVehicleAPI, createdActual);
                });
            });
        });
    });
}
