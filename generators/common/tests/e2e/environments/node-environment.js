const {GenericContainer} = require("testcontainers");
const request = require("supertest");
const NodeEnvironment = require('jest-environment-node').default;

class NodeGeneratorEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);
        console.log(config.globalConfig);
        console.log(config.projectConfig);
        this.testPath = context.testPath;
        this.docblockPragmas = context.docblockPragmas;
    }

    async setup() {
        await super.setup();
        await this.setupNodeEnvironment(this.testPath);

        this.global.containers = {
            api: this.apiContainer,
            app: this.appContainer,
        };

        this.global.requests = {
            api: request(`http://localhost:${this.apiContainer.getMappedPort(3000)}`),
            app: request(`http://localhost:${this.appContainer.getMappedPort(4200)}`)
        };
    }

    async teardown() {
        await this.teardownNodeEnvironment();
        await super.teardown();
    }

    getVmContext() {
        return super.getVmContext();
    }

    async setupNodeEnvironment() {
        const postgresContainer = await new GenericContainer("postgres")
            .withExposedPorts(5432)
            .withEnv("POSTGRES_USER", "test")
            .withEnv("POSTGRES_PASSWORD", "test")
            .withEnv("POSTGRES_DB", "test")
            .start();

        this.apiContainer = await new GenericContainer("generator-xmi-runner-node")
            .withExposedPorts(3000)
            .withCmd(["npm", "run", "api:start"])
            .withEnv('DB_HOST', postgresContainer.getIpAddress('bridge'))
            .start();

        this.appContainer = await new GenericContainer("generator-xmi-runner-node")
            .withExposedPorts(4200)
            .withCmd(["npm", "run", "app:start"])
            .start();

        await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    async teardownNodeEnvironment() {

    }
}

module.exports = NodeGeneratorEnvironment;
