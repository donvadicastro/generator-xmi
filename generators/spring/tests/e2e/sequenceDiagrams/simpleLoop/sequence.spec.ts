import {scenario as api} from 'generator-xmi-common/tests/e2e/scenarios/sequenceDiagrams/simpleLoop/sequence.scenario.api';
const request = require("supertest");

xdescribe('spring generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});
