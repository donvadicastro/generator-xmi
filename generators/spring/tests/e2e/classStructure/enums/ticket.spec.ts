import {scenario as api} from '../../../../../common/tests/e2e/scenarios/classStructure/enums/ticket.scenario.api';
const request = require("supertest");

describe('node generator E2E tests', () => {
    api(request(process.env.SPRING_API_URL));
});
