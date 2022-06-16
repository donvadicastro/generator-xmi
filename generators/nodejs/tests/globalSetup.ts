const {GenericContainer} = require("testcontainers");

module.exports = async () => {
    const postgresContainer = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withEnv("POSTGRES_USER", "test")
        .withEnv("POSTGRES_PASSWORD", "test")
        .withEnv("POSTGRES_DB", "test")
        .start();

    const apiContainer = await new GenericContainer("generator-xmi-runner-nodejs/api")
        .withExposedPorts(3000)
        .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
        .start();

    const appContainer = await new GenericContainer("generator-xmi-runner-nodejs/app")
        .withExposedPorts(80)
        .start();

    process.env.NODE_API_URL = `http://localhost:${apiContainer.getMappedPort(3000)}`;
    process.env.NODE_APP_URL = `http://localhost:${appContainer.getMappedPort(80)}`;

    await new Promise((resolve) => setTimeout(resolve, 10000));
};
