import {scenario as api} from 'generator-xmi-common/tests/e2e/scenarios/classDiagrams/associationRelation/passenger.scenario.api';

const request = require("supertest");

describe('spring generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});
