const request = require("supertest");

describe('nodejs generator E2E tests', () => {
    describe('x2-association-relation -> address', () => {
        describe('API server', () => {
            const API = request(process.env.NODE_API_URL);
            const rootAddressAPI = '/API/v1/class-diagrams/x2-association-relation/address';
            const rootPersonAPI = '/API/v1/class-diagrams/x2-association-relation/person';

            describe('should support GET method', () => {
                it('existing', async () =>
                    await API.get(rootAddressAPI).expect(200) );

                it('not found', async () =>
                    await API.get(`${rootAddressAPI}/0`).expect(404) );
            });

            describe('should support POST method', () => {
                let personId;
                let personRef = {firstName: "person1-first-name", lastName: "person1-last-name"};

                // create person to link with
                beforeAll(async () => {
                    personId = (await API.post(rootPersonAPI).send(personRef).expect(201)).body.id;
                });

                it('created', async () => {
                    const actual = {city: 'testCity', num: 'testNum', street: 'testStreet', personRef: personId};
                    const expected = {id: 1, city: 'testCity', num: 'testNum', street: 'testStreet', personRef: personId};

                    let response = await API.post(rootAddressAPI).send(actual).expect(201);
                    expect(response.body).toEqual(expected);

                    response = await API.get(`${rootAddressAPI}/1`).expect(200);
                    expect(response.body).toEqual(expected);
                });
            });

            describe('should support PUT method', () => {
                let id, personId1, personId2;
                const personRef1 = {firstName: "person1-first-name", lastName: "person1-last-name"};
                const personRef2 = {firstName: "person2-first-name", lastName: "person2-last-name"};
                const actual = {city: 'testCity', num: 'testNum', street: 'testStreet'};

                // create person to link with
                beforeAll(async () => {
                    personId1 = (await API.post(rootPersonAPI).send(personRef1).expect(201)).body.id;
                    personId2 = (await API.post(rootPersonAPI).send(personRef2).expect(201)).body.id;
                });

                // create address to update
                beforeAll(async () => {
                    id = (await API.post(rootAddressAPI).send({ ...actual, personRef: personId1 }).expect(201)).body.id;
                });

                it('updated', async () => {
                    const updateActual = { ...actual, city: 'testCityUpdated', personRef: personId1 };
                    const updateExpected = { ...updateActual, id: id };

                    let response = await API.put(`${rootAddressAPI}/${id}`).send(updateActual).expect(200);
                    expect(response.body).toEqual(updateExpected);

                    response = await API.get(`${rootAddressAPI}/${id}`).expect(200);
                    expect(response.body).toEqual(updateExpected);

                    // check parent
                    response = await API.get(`${rootPersonAPI}/${personId1}`).expect(200);
                    expect(response.body).toEqual({personRef1, addressRef: updateExpected});
                });
            });

            // deleteCheck(() => API, rootAddressAPI, deletedActual);
        });

        describe('APP server', () => {
            const APP = request(process.env.NODE_APP_URL);

            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
});
