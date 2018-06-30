import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiPackage} from "../xmiPackage";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiComponent} from "../xmiComponent";

export class xmiFragment extends xmiBase {
    lifelines: xmiLifeline[];
    interactionOperator: string;

    constructor(raw: any, parent: xmiBase, lifelines: xmiLifeline[]) {
        super(raw, parent);

        const covered = raw.$.covered ? [raw.$.covered] : raw.covered.map((x: any) => x.$['xmi:idref']);
        this.lifelines = lifelines.filter(x => covered.indexOf(x.id) >= 0);

        this.interactionOperator = raw.$.interactionOperator;

        if(this.interactionOperator) {
            this.lifelines.forEach(x => x.elementRef.fragments.push(this));
            covered.forEach((x: string) => {
                const c = <xmiComponent>xmiComponentFactory.getByKey(x);
                c && c.fragments.push(this);
            });
        }
    }
}