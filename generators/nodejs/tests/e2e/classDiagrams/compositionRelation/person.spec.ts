import {scenario as api} from '../../../../../common/tests/e2e/scenarios/classDiagrams/compositionRelation/person.scenario.api';
const request = require("supertest");

describe('node generator E2E tests', () => {
    api(request(process.env.NODE_API_URL));
});