import {scenario as api} from '../../../../../common/tests/e2e/scenarios/sequenceDiagrams/simpleSequence/sequence.scenario.api';
const request = require("supertest");

xdescribe('spring generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});
