import {scenario as api} from 'generator-xmi-common/tests/e2e/scenarios/classDiagrams/aggregationRelation/car.scenario.api';
const request = require("supertest");

describe('node generator E2E tests', () => {
    api(request(process.env.NODE_API_URL));
});
