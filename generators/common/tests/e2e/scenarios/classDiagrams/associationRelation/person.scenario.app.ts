export const scenario = (APP: any) => {
    describe('x2-association-relation -> person', () => {
        describe('APP server', () => {
            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
}
