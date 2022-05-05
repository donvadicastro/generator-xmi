import KeycloakConnect, {KeycloakConfig} from "keycloak-connect";

const session = require('express-session');

const keycloakConfig: KeycloakConfig = {
    'auth-server-url': process.env.KEYCLOAK_URL || '',
    'realm': process.env.KEYCLOAK_REALM || '',
    'resource': process.env.KEYCLOAK_CLIENTID || '',
    'bearer-only': true,
    'ssl-required': 'none',
    'confidential-port': 8443
};

export default new KeycloakConnect({ store: new session.MemoryStore() }, keycloakConfig);
