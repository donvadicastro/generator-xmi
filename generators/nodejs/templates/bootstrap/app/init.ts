import {KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {environment} from './environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => keycloak.init(environment.keycloak as KeycloakOptions);
}
