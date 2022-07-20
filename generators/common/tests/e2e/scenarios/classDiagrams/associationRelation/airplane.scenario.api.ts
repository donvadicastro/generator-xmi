import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> airplane', () => {
        xdescribe('API server with child', () => {
            const rootAirplaneAPI = '/api/v1/class-diagrams/x2-association-relation/airplane';

            const createdActual = { type: "created-type",
                passengerRefList: [{fullName: "create-pass1"}, {fullName: "create-pass2"}] };

            const updatedBefore = { type: "updated-before-type",
                passengerRefList: [{fullName: "updated-before-pass1"}] };

            const updatedAfter = { type: "updated-after-type",
                passengerRefList: [{fullName: "updated-after-pass1"}, {fullName: "updated-after-pass2"}]};

            const deletedActual = { type: "deleted-type",
                passengerRefList: [{fullName: "deleted-pass1"}, {fullName: "deleted-pass2"}]};

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
            const rootAirplaneAPI = '/api/v1/class-diagrams/x2-association-relation/airplane';

            const createdActual = { type: "created-type" };
            const updatedBefore = { type: "updated-before-type" };
            const updatedAfter = { type: "updated-after-type" };
            const deletedActual = { type: "deleted-type" };

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
