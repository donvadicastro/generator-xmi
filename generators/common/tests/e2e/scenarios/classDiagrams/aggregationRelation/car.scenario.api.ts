import {putCheck} from "../../../api/put.check";
import {deleteCheck} from "../../../api/delete.check";
import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x4-aggregation-relation -> car', () => {
        const rootPersonAPI = '/api/v1/class-diagrams/x4-aggregation-relation/person';
        const rootCarAPI = '/api/v1/class-diagrams/x4-aggregation-relation/car';

        /**
         * Requires separate parent PERSON to be created individually per each address (1-to-1 relation)
         * Address without person can be created (aggregation relation, can exists outside of person lifecycle)
         * Address is not destroyed when root person is deleted (aggregation relation, exists outside of person lifecycle)
         */
        describe('API server without child', () => {
            describe('should support PUT method', () => {
                const updatedBefore: any = { brand: "before-first-name" };
                const updatedAfter: any = { brand: "after-first-name" };

                beforeAll(async () => {
                    const person: any = { firstName: "update-first-name", lastName: "update-last-name" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    updatedBefore.personRef = person;
                    updatedAfter.personRef = person;
                });

                putCheck(() => API, rootCarAPI, () => updatedBefore, () => updatedAfter);
            });

            describe('should support DELETE method', () => {
                const deletedActual: any = { brand: "delete-brand" };

                beforeAll(async () => {
                    const person: any = { firstName: "delete-first-name", lastName: "delete-last-name" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    deletedActual.personRef = person;
                });

                deleteCheck(() => API, rootCarAPI, () => deletedActual);

                it('should not delete CAR when parent PERSON deleted', async () => {
                    const person: any = { firstName: "delete-parent-first-name", lastName: "delete-parent-last-name" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    const deletedParent: any = { brand: "delete-parent-brand", personRef: person };
                    deletedParent.id = await postCheck(API, rootCarAPI, deletedParent);

                    // car is linked to person, so person can't be just deleted without managing this reference first
                    await API.delete(`${rootPersonAPI}/${person.id}`).expect(500);
                    await API.get(`${rootCarAPI}/${deletedParent.id}`).expect(200);

                    // unlink car to safely delete person, check "car" is not accessible after parent deletion
                    await API.put(`${rootCarAPI}/${deletedParent.id}`).send({...deletedParent, personRef: null}).expect(200);
                    await API.delete(`${rootPersonAPI}/${person.id}`).expect(200);
                    await API.get(`${rootCarAPI}/${deletedParent.id}`).expect(200);
                });
            });

            describe('should support POST method', () => {
                it('created', async () => {
                    const person: any = { firstName: "create-first-name", lastName: "create-last-name" };
                    person.id = await postCheck(API, rootPersonAPI, person);

                    const createdActual = { brand: "created-brand", personRef: person };
                    await postCheck(API, rootCarAPI, createdActual);
                });
            });
        })
    });
}
