import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-complex-data-types -> person', () => {
        describe('API server', () => {
            const rootPersonAPI = '/api/v1/class-structure/x2-complex-data-types/person';

            const createdActual = {
                name: "created-first-name",
                address: {city: "createdCityInfo", isPrimary: true, state: 'createdStateInfo'}
            };
            const updatedBefore = {
                name: "updatedBefore-first-name",
                address: {city: "updatedBeforeCityInfo", isPrimary: false, state: 'updatedBeforeStateInfo'}
            };
            const updatedAfter = {
                name: "updatedAfter-first-name",
                address: {city: "updatedAfterCityInfo", isPrimary: true, state: 'updatedAfterStateInfo'}
            };
            const deletedActual = {
                name: "deleted-first-name",
                address: {city: "deletedCityInfo", isPrimary: true, state: 'deletedStateInfo'}
            };

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
        });
    });
}
