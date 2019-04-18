import xmiConnectorParty from "../entities/connectors/xmiConnectorParty";

export interface IConnector {
    source: xmiConnectorParty;
    target: xmiConnectorParty;
    condition: string;
}
