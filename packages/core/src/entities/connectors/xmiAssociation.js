"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiAssociation = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const xmiAssociationParty_1 = require("./xmiAssociationParty");
class xmiAssociation extends xmiBase_1.default {
    constructor(raw, factory) {
        super(raw, null, factory);
        this.ownedEnds = raw.ownedEnd.map((x) => new xmiAssociationParty_1.xmiAssociationParty(x, factory));
    }
}
exports.xmiAssociation = xmiAssociation;
//# sourceMappingURL=xmiAssociation.js.map