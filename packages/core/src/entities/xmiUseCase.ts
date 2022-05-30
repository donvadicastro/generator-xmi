import xmiBase from "./xmiBase";
import {get} from "object-path";
import {xmiComponentFactory} from "../factories/xmiComponentFactory";

export class xmiUseCase extends xmiBase {
    scenarios: {type: string, steps: string[]}[];

    constructor(raw: any, parent: xmiBase, factory: xmiComponentFactory) {
        super(raw, parent, factory);

        this.scenarios = get(raw, ['EAModel.scenario', '0', 'EAScenario'], [])
            .map((x: any) => ({
                type: x.$.name,
                steps: get(x, ['EAScenarioContent', '0', 'path', '0', 'step'], []).map((x: any) => x.$.name)
            }));
    }
}
