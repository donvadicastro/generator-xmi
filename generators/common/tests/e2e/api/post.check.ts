export const postCheck = (req: () => any, rootUrl: string, actual: any) => {
    describe('should support POST method', () => {
        it('created', async () => {
            let response = await req().post(rootUrl).send(actual).expect(201);

            const id = response.body.id;
            const expected = {...actual, id: id};

            expect(response.body).toEqual(expected);

            response = await req().get(`${rootUrl}/${id}`).expect(200);
            expect(response.body).toEqual(expected);
        });
    });
}
