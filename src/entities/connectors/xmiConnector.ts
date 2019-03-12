import xmiConnectorParty from "./xmiConnectorParty";

export default class xmiConnector {
    id: string;
    raw: any;

    source: xmiConnectorParty;
    target: xmiConnectorParty;

    constructor(raw: any) {
        this.raw = raw;
        this.id = raw.$['xmi:idref'];

        this.source = new xmiConnectorParty(raw.source[0]);
        this.target = new xmiConnectorParty(raw.target[0]);
    }
}