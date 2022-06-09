/**
 * Check post action.
 *
 * @param req request handler
 * @param rootUrl resource root API
 * @param actual actual payload to store
 */
export async function postCheck(req: any, rootUrl: string, actual: any): Promise<number> {
    let response = await req.post(rootUrl).send(actual).expect(201);

    const location = response.get('Location');
    expect(location).toBeDefined();

    const id = location.split('/').pop() - 0;
    expect(id).toEqual(expect.any(Number));

    const expected = {...actual, id: id};
    expect(response.body).toEqual({});

    response = await req.get(`${rootUrl}/${id}`).expect(200);
    expect(response.body).toEqual(expected);

    return id;
}