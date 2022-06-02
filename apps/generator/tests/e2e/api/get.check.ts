export const getCheck = (req: () => any, rootUrl: string) => {
    describe('should support GET method', () => {
        it('existing', async () => {
            await req().get(rootUrl).expect(200);
        });

        it('not found', async () => {
            await req().get(`${rootUrl}/0`).expect(404);
        });
    });
}
