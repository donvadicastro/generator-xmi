import {scenario as api} from '../../../../../common/tests/e2e/scenarios/classDiagrams/associationRelation/student.scenario.api';
const request = require("supertest");

describe('spring generator E2E tests', () => {
    api(request(process.env.NODE_API_URL));
});
