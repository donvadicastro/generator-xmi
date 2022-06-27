export const scenario = (APP: any) => {
    describe('x1-simple-independent-classes -> vehicle', () => {
        describe('APP server', () => {
            it('should start APP server successfully', async () => {
                await APP.get('/').expect(200);
            });
        });
    });
}
