import {postCheck} from "./post.check";

export const deleteCheck = (req: () => any, rootUrl: string, supplyBefore: () => any) => {
    let id = 0;

    beforeAll(async () => id = await postCheck(req(), rootUrl, supplyBefore()));

    it('deleted', async () => {
        const response = await req().delete(`${rootUrl}/${id}`);
        expect(response.body).toMatchObject(supplyBefore());
        expect(response.status).toBe(200);

        await req().get(`${rootUrl}/${id}`).expect(404);

        // second time to delete
        await req().delete(`${rootUrl}/${id}`).expect(404);
    });

    it('not found', async () => {
        await req().get(`${rootUrl}/99999`).expect(404);
    });

}
