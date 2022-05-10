"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiAggregationLink = void 0;
const xmiLink_1 = require("./xmiLink");
class xmiAggregationLink extends xmiLink_1.xmiLink {
    constructor(raw, parent, factory) {
        super(raw, parent, factory);
        this.connector = this._factory.connectorHash[this.id];
    }
}
exports.xmiAggregationLink = xmiAggregationLink;
//# sourceMappingURL=xmiAggregationLink.js.map