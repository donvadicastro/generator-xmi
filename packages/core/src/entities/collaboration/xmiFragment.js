"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmiFragment = void 0;
const xmiBase_1 = __importDefault(require("../xmiBase"));
const rxjs_1 = require("rxjs");
class xmiFragment extends xmiBase_1.default {
    constructor(raw, parent, factory, lifelines) {
        super(raw, parent, factory);
        /**
         * Links to operands in combined fragments when this entity belongs to.
         */
        this.operands = [];
        this.interactionOperator = raw.$.interactionOperator;
        // get covered id's as list, clean duplicates
        const covered = (raw.$.covered ? [raw.$.covered] : raw.covered.map((x) => x.$['xmi:idref']))
            .filter((x, i, arr) => arr.indexOf(x) === i);
        this.lifelines = lifelines.filter(x => covered.indexOf(x.id) >= 0);
        rxjs_1.forkJoin(covered.map(x => this._factory.resolveById(x))).subscribe(result => {
            rxjs_1.forkJoin(result.map(y => y.onAfterInit)).subscribe((initialized) => {
                initialized.forEach(i => {
                    this.lifelines.indexOf(i) >= 0 || this.lifelines.push(i);
                    if (this.interactionOperator) {
                        i.elementRef.fragments.indexOf(this) >= 0 || i.elementRef.fragments.push(this); // add lifelines to referenced fragments
                    }
                });
                this.initialized();
            });
        });
    }
}
exports.xmiFragment = xmiFragment;
//# sourceMappingURL=xmiFragment.js.map