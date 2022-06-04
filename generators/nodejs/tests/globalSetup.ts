const {GenericContainer} = require("testcontainers");

module.exports = async () => {
    const postgresContainer = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withEnv("POSTGRES_USER", "test")
        .withEnv("POSTGRES_PASSWORD", "test")
        .withEnv("POSTGRES_DB", "test")
        .start();

    const apiContainer = await new GenericContainer("generator-xmi-runner-nodejs")
        .withExposedPorts(3000)
        .withCmd(["npm", "run", "api:start"])
        .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
        .start();

    const appContainer = await new GenericContainer("generator-xmi-runner-nodejs")
        .withExposedPorts(4200)
        .withCmd(["npm", "run", "app:start"])
        .start();

    process.env.NODE_API_URL = `http://localhost:${apiContainer.getMappedPort(3000)}`;
    process.env.NODE_APP_URL = `http://localhost:${appContainer.getMappedPort(4200)}`;

    await new Promise((resolve) => setTimeout(resolve, 10000));
};
