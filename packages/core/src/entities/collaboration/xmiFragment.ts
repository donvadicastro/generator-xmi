import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiOperand} from "./xmiOperand";
import {forkJoin} from 'rxjs';

export class xmiFragment extends xmiBase {
    lifelines: xmiLifeline[];
    interactionOperator: string;

    /**
     * Links to operands in combined fragments when this entity belongs to.
     */
    operands: xmiOperand[] = [];

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory, lifelines: xmiLifeline[]) {
        super(raw, parent, factory);

        this.interactionOperator = raw.$.interactionOperator;

        // get covered id's as list, clean duplicates
        const covered: string[] = (raw.$.covered ? [raw.$.covered] : raw.covered.map((x: any) => x.$['xmi:idref']))
            .filter((x: string, i: number, arr: string[]) => arr.indexOf(x) === i);

        this.lifelines = lifelines.filter(x => covered.indexOf(x.id) >= 0);

        forkJoin(covered.map(x => this._factory.resolveById(x))).subscribe(result => {
            forkJoin(result.map(y => (<xmiLifeline>y).onAfterInit)).subscribe((initialized: any[]) => {
                initialized.forEach(i => {
                    this.lifelines.indexOf(i) >= 0 || this.lifelines.push(i);

                    if(this.interactionOperator) {
                        i.elementRef.fragments.indexOf(this) >= 0 || i.elementRef.fragments.push(this);       // add lifelines to referenced fragments
                    }
                });

                this.initialized();
            })
        });
    }
}
