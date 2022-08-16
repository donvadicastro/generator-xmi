export const scenario = (API: any) => {
    describe('sequence-diagrams -> simple-loop', () => {
        describe('API server', () => {
            const sequenceAPI = '/api/v1/sequence-diagrams/x1-simple-loop';

            it('should support POST method', async () => {
                const response = await API.post(sequenceAPI).expect(201);
                expect(response.body).toMatchObject({
                    history: [
                        "--> initialize local state storage",
                        "--> componentA1::actionA1",
                        "--> componentB1::actionB1"
                    ]
                });
            });
        });
    });
}
