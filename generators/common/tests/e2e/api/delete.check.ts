export const deleteCheck = (req: () => any, rootUrl: string, before: any) => {
    describe('should support DELETE method', () => {
        let id = 0;

        beforeAll(async () => {
            let response = await req().post(rootUrl).send(before).expect(201);
            id = response.body.id;
        });

        it('deleted', async () => {
            await req().delete(`${rootUrl}/${id}`).expect(200);
            await req().get(`${rootUrl}/${id}`).expect(404);

            // second time to delete
            await req().delete(`${rootUrl}/${id}`).expect(404);
        });

        it('not found', async () => {
            await req().get(`${rootUrl}/99999`).expect(404);
        });
    });
}
