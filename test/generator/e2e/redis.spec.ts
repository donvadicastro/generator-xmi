const redis = require("async-redis");
const { GenericContainer } = require("testcontainers");

describe("GenericContainer", () => {
    let container: any;
    let redisClient: any;

    beforeAll(async () => {
        jest.setTimeout(240000);

        container = await new GenericContainer("redis")
            .withExposedPorts(6379)
            .start();

        redisClient = redis.createClient(
            container.getMappedPort(6379),
            container.getHost(),
        );
    });

    afterAll(async () => {
        await redisClient.quit();
        await container.stop();
    });

    it("works", async () => {
        await redisClient.set("key", "val");
        expect(await redisClient.get("key")).toBe("val");
    });
});
