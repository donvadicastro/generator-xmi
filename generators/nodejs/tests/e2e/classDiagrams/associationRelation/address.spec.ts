import {scenario as api} from '../../../../../common/tests/e2e/scenarios/classDiagrams/associationRelation/address.scenario.api';
import {scenario as app} from '../../../../../common/tests/e2e/scenarios/classDiagrams/associationRelation/address.scenario.app';
const request = require("supertest");

describe('spring generator E2E tests', () => {
    api(request(process.env.NODE_API_URL));
    app(request(process.env.NODE_APP_URL));
});
