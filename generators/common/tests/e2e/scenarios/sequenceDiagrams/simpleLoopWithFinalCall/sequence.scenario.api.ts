export const scenario = (API: any) => {
    describe('sequence-diagrams -> simple-sequence', () => {
        describe('API server', () => {
            const sequenceAPI = '/api/v1/sequence-diagrams/x2-simple-loop-with-final-call';

            it('should support POST method', async () => {
                const response = await API.post(sequenceAPI).expect(201);
                expect(response.body).toMatchObject({
                    history: [
                        "--> initialize local state storage",
                        "--> componentA2::actionA1",
                        "--> componentB2::actionB2"
                    ]
                });
            });
        });
    });
}
