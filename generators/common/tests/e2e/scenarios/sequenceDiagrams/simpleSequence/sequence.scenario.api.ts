export const scenario = (API: any) => {
    describe('sequence-diagrams -> simple-sequence', () => {
        describe('API server', () => {
            const sequenceAPI = '/api/v1/sequence-diagrams/x3-simple-sequence';

            it('should support POST method', async () => {
                const response = await API.post(sequenceAPI).expect(201);
                expect(response.body).toMatchObject({
                    history: [
                        "--> initialize local state storage",
                        "--> firstComponent::operation11",
                        "--> secondComponent::operation21",
                        "--> thirdComponent::operation31",
                        "--> thirdComponent::operation32",
                        "--> secondComponent::operation22",
                        "--> firstComponent::operation12",
                        "--> thirdComponent::operation32",
                    ]
                });
            });
        });
    });
}
