import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x3-composition-relation -> address', () => {
        const rootPersonAPI = '/api/v1/class-diagrams/x3-composition-relation/person';
        const rootAddressAPI = '/api/v1/class-diagrams/x3-composition-relation/address';

        /**
         * Requires separate parent PERSON to be created individually per each address (1-to-1 relation)
         * Address without person can't be created (composition relation, not exists outside of person lifecycle)
         * Address is destroyed when root person is deleted (composition relation, not exists outside of person lifecycle)
         */
        describe('API server without child', () => {
            describe('should support PUT method', () => {
                const updatedBefore: any = { city: "before-first-name", num: "before-last-name", street: "2021-07-21T20:40:40.718Z" };
                const updatedAfter: any = { city: "after-first-name", num: "after-last-name", street: "2020-07-21T20:40:40.718Z" };

                beforeAll(async () => {
                    const person: any = { firstName: "update-first-name", lastName: "update-last-name", birthday: "2022-07-21T20:40:40.718Z" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    updatedBefore.personRef = person;
                    updatedAfter.personRef = person;
                });

                putCheck(() => API, rootAddressAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                const deletedActual: any = { city: "delete-first-name", num: "delete-last-name", street: "2019-07-21T20:40:40.718Z" };

                beforeAll(async () => {
                    const person: any = { firstName: "delete-first-name", lastName: "delete-last-name", birthday: "2022-07-21T20:40:40.718Z" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    deletedActual.personRef = person;
                });

                deleteCheck(() => API, rootAddressAPI, () => deletedActual);

                it('should delete ADDRESS when parent PERSON deleted', async () => {
                    const person: any = { firstName: "delete-parent-first-name", lastName: "delete-parent-last-name", birthday: "2022-07-21T20:40:40.718Z" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    const deletedParent: any = { city: "delete-parent-first-name", num: "delete-parent-last-name", street: "2019-07-21T20:40:40.718Z", personRef: person };
                    deletedParent.id = await postCheck(API, rootAddressAPI, deletedParent);

                    // unlink address is not allowed in this reference type
                    await API.put(`${rootAddressAPI}/${deletedParent.id}`).send({...deletedParent, personRef: null}).expect(500);

                    // should delete linked address as part of person deletion
                    await API.delete(`${rootPersonAPI}/${person.id}`).expect(200);
                    await API.get(`${rootAddressAPI}/${deletedParent.id}`).expect(404);
                });
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    const person: any = { firstName: "create-first-name", lastName: "create-last-name", birthday: "2022-07-21T20:40:40.718Z" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    const createdActual = { city: "created-city", num: "created-last-name", street: "2022-07-21T20:40:40.718Z", personRef: person };
                    await postCheck(API, rootAddressAPI, createdActual);
                });
            });
        })
    });
}
