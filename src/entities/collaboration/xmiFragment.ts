import xmiBase from "../xmiBase";
import {xmiLifeline} from "../xmiLifeline";
import {xmiPackage} from "../xmiPackage";
import {xmiComponentFactory} from "../../factories/xmiComponentFactory";
import {xmiComponent} from "../xmiComponent";

export class xmiFragment extends xmiBase {
    lifelines: (xmiLifeline | {elementRef: xmiComponent})[];
    interactionOperator: string;

    constructor(raw: any, parent: xmiBase, lifelines: xmiLifeline[]) {
        super(raw, parent);

        // get covered id's as list, clean duplicates
        const covered: string[] = (raw.$.covered ? [raw.$.covered] : raw.covered.map((x: any) => x.$['xmi:idref']))
            .filter((x: string, i: number, arr: string[]) => arr.indexOf(x) === i);

        //this.lifelines = lifelines.filter(x => covered.indexOf(x.id) >= 0);
        this.lifelines = covered.map(x => <xmiLifeline>xmiComponentFactory.getByKey(x))
            .map(x => x instanceof xmiLifeline ? x : {elementRef: x}); //can be other types here

        this.interactionOperator = raw.$.interactionOperator;

        if(this.interactionOperator) {
            this.lifelines.forEach(x => {
                // add lifeline to referenced fragments
                x.elementRef.fragments.push(this);
            });

            covered.forEach((x: string) => {
                const c = <xmiComponent>xmiComponentFactory.getByKey(x);
                const self = this;

                c ? c.fragments.push(this) :
                    xmiComponentFactory.resolveKeyDeffered(x, (x) => (<xmiComponent>x).fragments.push(self));
            });
        }
    }
}