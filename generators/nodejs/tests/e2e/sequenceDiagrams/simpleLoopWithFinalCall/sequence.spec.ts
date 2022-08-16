import {scenario as api} from '../../../../../common/tests/e2e/scenarios/sequenceDiagrams/simpleLoopWithFinalCall/sequence.scenario.api';
const request = require("supertest");

describe('node generator E2E tests', () => {
    api(request(process.env.NODE_API_URL));
});
