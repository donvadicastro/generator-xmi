import {scenario as api} from '../../../../../common/tests/e2e/scenarios/sequenceDiagrams/simpleSequence/sequence.scenario.api';
const request = require("supertest");

// not supported yet
xdescribe('node generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});
