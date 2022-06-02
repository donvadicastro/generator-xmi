export const postCheck = (req: () => any, rootUrl: string, actual: any, expected: any) => {
    describe('should support POST method', () => {
        it('created', async () => {
            let response = await req().post(rootUrl).send(actual).expect(201);
            expect(response.body).toEqual(expected);

            response = await req().get(`${rootUrl}/1`).expect(200);
            expect(response.body).toEqual(expected);
        });
    });
}
