import {scenario as api} from '../../../../../common/tests/e2e/scenarios/classDiagrams/aggregationRelation/car.scenario.api';
const request = require("supertest");

describe('spring generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});