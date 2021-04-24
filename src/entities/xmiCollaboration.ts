import xmiBase from "./xmiBase";
import {xmiLifeline} from "./xmiLifeline";
import {get} from 'object-path';
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiMessage} from "./collaboration/xmiMessage";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
import {xmiCombinedFragment} from "./collaboration/xmiCombinedFragment";
import {forkJoin, of} from "rxjs";
import {ArrayUtils} from "../utils/arrayUtils";

const assert = require('assert');

export class xmiCollaboration extends xmiBase {
    attributes: xmiAttribute[];
    lifelines: xmiLifeline[];
    fragments: (xmiFragment | xmiCombinedFragment)[] = [];
    messages: xmiMessage[] = [];

    constructor(raw: any, parent: xmiPackage, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this.attributes = (this._raw.ownedAttribute || [])
            .map((x: any) => new xmiAttribute(x, this, factory));

        this.lifelines = get(this._raw, 'ownedBehavior.0.lifeline', [])
            .map((x: any) => <xmiLifeline>this._factory.get(x, this, this.attributes));

        this.fragments = get(this._raw, 'ownedBehavior.0.fragment', [])
            .map((x: any) => <xmiFragment>this._factory.get(x, this, this.lifelines));

        this.messages = get(this._raw, 'ownedBehavior.0.message', [])
            .map((x: any) => {
                const message = <xmiMessage>this._factory.get(x, this, this.fragments);

                forkJoin({
                    from: message.from ? message.from.onAfterInit : of(),
                    to: message.to ? message.to.onAfterInit : of()
                }).subscribe(() => {
                    //when lifeline is not presenter in XMI, but message use
                    if(message.from && !this.lifelines.find(x => x.elementRef === message.from.elementRef)) {
                        const lifeline = this._factory.lifelineHash.find(x => x.elementRef === message.from.elementRef);
                        assert(lifeline, `Lifeline for FROM (${message.from.elementRef.name}) object not exists: ${this.path.map(x => x.name).join(' -> ')}`);

                        this.lifelines.push(<xmiLifeline>lifeline);
                    }

                    //when lifeline is not presenter in XMI, but message use
                    if(message.to && !this.lifelines.find(x => (x || {}).elementRef === message.to.elementRef)) {
                        const lifeline = this._factory.lifelineHash.find(x => x.elementRef === message.to.elementRef);
                        assert(lifeline, `Lifeline for TO(${message.to.elementRef.name}) object not exists: ${this.path.map(x => x.name).join(' -> ')}`);

                        this.lifelines.push(<xmiLifeline>lifeline);
                    }
                });

                return message;
            });
    }

    initialize() {
    }

    get loopFragments(): xmiCombinedFragment[] {
        return <xmiCombinedFragment[]>this.fragments.filter(x => x.type === 'uml:CombinedFragment' && x.interactionOperator === 'loop');
    }

    get conditionFragments(): xmiCombinedFragment[] {
        return <xmiCombinedFragment[]>this.fragments.filter(x => x.type === 'uml:CombinedFragment' && x.interactionOperator === 'alt');
    }

    get references(): xmiBase[] {
        const imports = super.references;

        this.lifelines.forEach((lifeline, index) =>
            ArrayUtils.insertIfNotExists(lifeline.elementRef, imports));

        return imports;
    }

    toConsole() {
        return {
            lifelines: this.lifelines.map(x => x.toConsole()),
            fragments: this.fragments.filter(x => x.name).map(x => x.toConsole()),
            messages: this.messages.map(x => x.toConsole())
        };
    }
}
