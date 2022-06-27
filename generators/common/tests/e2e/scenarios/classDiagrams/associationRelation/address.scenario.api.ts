import {postCheck} from "../../../api/post.check";

export const scenario = (API: any) => {
    describe('x2-association-relation -> address', () => {
        describe('API server', () => {
            const rootAddressAPI = '/api/v1/class-diagrams/x2-association-relation/address';
            const rootPersonAPI = '/api/v1/class-diagrams/x2-association-relation/person';

            describe('should support GET method', () => {
                it('existing', async () =>
                    await API.get(rootAddressAPI).expect(200));

                it('not found', async () =>
                    await API.get(`${rootAddressAPI}/0`).expect(404));
            });

            describe('should support POST method', () => {
                let personId;
                const personRef = {firstName: "person1-first-name", lastName: "person1-last-name"};

                // create person to link with
                beforeAll(async () => {
                    personId = await postCheck(API, rootPersonAPI, personRef);
                });

                it('created', async () => {
                    const actual = {
                        city: 'testCity',
                        num: 'testNum',
                        street: 'testStreet',
                        personRef: {...personRef, id: personId}
                    };
                    await postCheck(API, rootAddressAPI, actual);
                });
            });

            describe('should support PUT method', () => {
                let id, personId1, personId2;
                const personRef1 = {firstName: "person1-first-name", lastName: "person1-last-name"};
                const personRef2 = {firstName: "person2-first-name", lastName: "person2-last-name"};
                const actual = {city: 'testCity', num: 'testNum', street: 'testStreet'};

                // create person to link with
                beforeAll(async () => {
                    personId1 = await postCheck(API, rootPersonAPI, personRef1);
                    personId2 = await postCheck(API, rootPersonAPI, personRef2);
                    id = await postCheck(API, rootAddressAPI, {...actual, personRef: {...personRef1, id: personId1}})
                });

                it('updated', async () => {
                    let updateActual = {...actual, city: 'testCityUpdated'};
                    let updateExpected = {...updateActual, id: id, personRef: {...personRef1, id: personId1}};

                    // TODO: require `PersonRef` as part of payload, review possibility only id to use
                    const data = {...updateActual, personRef: {...personRef1, id: personId1}};
                    let response = await API.put(`${rootAddressAPI}/${id}`).send(data).expect(200);
                    expect(response.body).toEqual(updateExpected);

                    response = await API.get(`${rootAddressAPI}/${id}`).expect(200);
                    expect(response.body).toEqual(updateExpected);

                    // check parent
                    // parent Person entity contains address without cross link back to parent
                    // response = await API.get(`${rootPersonAPI}/${personId1}`).expect(200);
                    // expect(response.body.addressRef).toEqual({...updateActual, id: id});
                });
            });

            // deleteCheck(() => API, rootAddressAPI, deletedActual);
        });
    });
}
