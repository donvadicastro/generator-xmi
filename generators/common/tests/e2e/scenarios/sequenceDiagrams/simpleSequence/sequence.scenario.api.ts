export const scenario = (API: any) => {
    describe('sequence-diagrams -> simple-sequence', () => {
        describe('API server', () => {
            const sequenceAPI = '/api/v1/sequence-diagrams/x3-simple-sequence';

            it('should support POST method', async () => {
                await API.post(sequenceAPI).expect(201);
            });
        });
    });
}
