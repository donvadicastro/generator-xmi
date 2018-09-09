import xmiBase from "./xmiBase";
import {xmiLifeline} from "./xmiLifeline";
import {get} from 'object-path';
import {xmiAttribute} from "./class/xmiAttribute";
import {xmiMessage} from "./collaboration/xmiMessage";
import {xmiFragment} from "./collaboration/xmiFragment";
import {xmiPackage} from "./xmiPackage";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";
const assert = require('assert');

export class xmiCollaboration extends xmiBase {
    attributes: xmiAttribute[];
    lifelines: xmiLifeline[];
    fragments: xmiFragment[] = [];
    messages: xmiMessage[] = [];

    constructor(raw: any, parent: xmiPackage | null) {
        super(raw, parent);

        this.attributes = (this.raw.ownedAttribute || [])
            .map((x: any) => new xmiAttribute(x, this));

        this.lifelines = get(this.raw, 'ownedBehavior.0.lifeline', [])
            .map((x: any) => <xmiLifeline>xmiComponentFactory.get(x, this, this.attributes));
    }

    initialize() {
        this.fragments = get(this.raw, 'ownedBehavior.0.fragment', [])
            .map((x: any) => <xmiFragment>xmiComponentFactory.get(x, this, this.lifelines));

        this.messages = get(this.raw, 'ownedBehavior.0.message', [])
            .map((x: any) => {
                const message = <xmiMessage>xmiComponentFactory.get(x, this, this.fragments);

                //when lifeline is not presenter in XMI, but message use
                if(message.from && !this.lifelines.find(x => x.elementRef === message.from.elementRef)) {
                    const lifeline = xmiComponentFactory.instance.lifelineHash.find(x => x.elementRef === message.from.elementRef);
                    assert(lifeline, `Lifeline for FROM (${message.from.elementRef.name}) object not exists: ${this.path.map(x => x.name).join(' -> ')}`);

                    this.lifelines.push(<xmiLifeline>lifeline);
                }

                //when lifeline is not presenter in XMI, but message use
                if(message.to && !this.lifelines.find(x => x.elementRef === message.to.elementRef)) {
                    const lifeline = xmiComponentFactory.instance.lifelineHash.find(x => x.elementRef === message.to.elementRef);
                    assert(lifeline, `Lifeline for TO(${message.to.elementRef.name}) object not exists: ${this.path.map(x => x.name).join(' -> ')}`);

                    this.lifelines.push(<xmiLifeline>lifeline);
                }

                return message;
            });
    }

    get loopFragments() {
        return this.fragments.filter(x => x.type === 'uml:CombinedFragment' && x.interactionOperator === 'loop');
    }

    toConsole() {
        return {
            lifelines: this.lifelines.map(x => x.toConsole()),
            fragments: this.fragments.filter(x => x.name).map(x => x.toConsole()),
            messages: this.messages.map(x => x.toConsole())
        };
    }
}
