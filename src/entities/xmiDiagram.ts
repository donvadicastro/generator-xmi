import xmiBase from "./xmiBase";

export class xmiDiagram extends xmiBase {
  constructor(raw: any) {
    super(raw);

    this.type = this.raw.properties[0].$.type;
    this.name = this.raw.properties[0].$.name;
  }
}
