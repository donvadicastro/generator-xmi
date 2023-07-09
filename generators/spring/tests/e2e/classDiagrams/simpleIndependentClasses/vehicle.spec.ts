import {scenario} from 'generator-xmi-common/tests/e2e/scenarios/classDiagrams/simpleIndependentClasses/vehicle.scenario.api';
const request = require("supertest");

describe('spring generator E2E tests', () => {
    scenario(request(process.env.SPRING_API_URL));
});
