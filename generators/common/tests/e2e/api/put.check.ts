import {postCheck} from "./post.check";

export const putCheck = (req: () => any, rootUrl: string, supplyBefore: () => any, supplyAfter: () => any) => {
    let id = 0;

    beforeAll(async () => id = await postCheck(req(), rootUrl, supplyBefore()));

    it('updated', async () => {
        const after = supplyAfter();
        let expected = { id: id, ...after };

        let response = await req().put(`${rootUrl}/${id}`).send(after).expect(200);
        expect(response.body).toEqual(expected);

        response = await req().get(`${rootUrl}/${id}`).expect(200);
        expect(response.body).toEqual(expect.objectContaining(expected));
    });
}
