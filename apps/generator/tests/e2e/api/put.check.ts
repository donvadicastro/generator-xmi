export const putCheck = (req: () => any, rootUrl: string, before: any, after: any) => {
    describe('should support PUT method', () => {
        let id = 0;

        beforeAll(async () => {
            let response = await req().post(rootUrl).send(before).expect(201);
            id = response.body.id;
        });

        it('updated', async () => {
            let expected = { id: id, ...after };

            let response = await req().put(`${rootUrl}/${id}`).send(after).expect(200);
            expect(response.body).toEqual(expected);

            response = await req().get(`${rootUrl}/${id}`).expect(200);
            expect(response.body).toEqual(expected);
        });
    });
}
