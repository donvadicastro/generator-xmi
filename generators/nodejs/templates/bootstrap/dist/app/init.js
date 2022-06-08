"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environments/environment");
function initializer(keycloak) {
    return () => keycloak.init(environment_1.environment.keycloak);
}
exports.initializer = initializer;
//# sourceMappingURL=init.js.map