import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> passenger', () => {
        const rootAirplaneAPI = '/api/v1/class-diagrams/x2-association-relation/airplane';
        const rootPassengerAPI = '/api/v1/class-diagrams/x2-association-relation/passenger';

        let airplaneId, createdActual, updatedBefore, updatedAfter, deletedActual;

        // create airplane to link with
        beforeAll(async () => {
            let airplaneRef: {id?: string, type: string} = { type: "reference-type" };

            airplaneId = await postCheck(API, rootAirplaneAPI, airplaneRef);
            airplaneRef.id = airplaneId;

            createdActual = { fullName: "created-type", airplaneRef: airplaneRef };
            updatedBefore = { fullName: "updated-before-fullName", airplaneRef: airplaneRef };
            updatedAfter = { fullName: "updated-after-fullName", airplaneRef: airplaneRef };
            deletedActual = { fullName: "deleted-fullName", airplaneRef: airplaneRef };
        });

        describe('should support PUT method', () => {
            putCheck(() => API, rootPassengerAPI, () => updatedBefore, () => updatedAfter);
        });

        describe('should support DELETE method', () => {
            deleteCheck(() => API, rootPassengerAPI, () => deletedActual);
        });

        describe('should support POST method', () => {
            it('created', async () => {
                await postCheck(API, rootPassengerAPI, createdActual);
            });
        });
    });
}
