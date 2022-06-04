"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keycloak_connect_1 = __importDefault(require("keycloak-connect"));
const session = require('express-session');
const keycloakConfig = {
    'auth-server-url': process.env.KEYCLOAK_URL || '',
    'realm': process.env.KEYCLOAK_REALM || '',
    'resource': process.env.KEYCLOAK_CLIENTID || '',
    'bearer-only': true,
    'ssl-required': 'none',
    'confidential-port': 8443
};
exports.default = new keycloak_connect_1.default({ store: new session.MemoryStore() }, keycloakConfig);
//# sourceMappingURL=keycloak.js.map