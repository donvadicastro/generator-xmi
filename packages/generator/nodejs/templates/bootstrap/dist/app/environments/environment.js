"use strict";
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const config = require('!!raw-loader!../../.env').split('\n')
    .map((x) => x.split('='))
    .reduce((prev, x) => { prev[x[0]] = x[1]; return prev; }, {});
exports.environment = {
    production: false,
    keycloak: {
        config: { url: config.KEYCLOAK_URL, realm: config.KEYCLOAK_REALM, clientId: config.KEYCLOAK_CLIENTID },
        initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false
        },
        enableBearerInterceptor: true
    },
    api: {
        url: config.API_URL
    }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
//# sourceMappingURL=environment.js.map