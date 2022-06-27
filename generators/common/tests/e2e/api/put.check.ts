import {postCheck} from "./post.check";

export const putCheck = (req: () => any, rootUrl: string, before: any, after: any) => {
    describe('should support PUT method', () => {
        let id = 0;

        beforeAll(async () => id = await postCheck(req(), rootUrl, before));

        it('updated', async () => {
            let expected = { id: id, ...after };

            let response = await req().put(`${rootUrl}/${id}`).send(after).expect(200);
            expect(response.body).toEqual(expected);

            response = await req().get(`${rootUrl}/${id}`).expect(200);
            expect(response.body).toEqual(expect.objectContaining(expected));
        });
    });
}
