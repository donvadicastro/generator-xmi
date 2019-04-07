import xmiBase from "./xmiBase";
import {get} from "object-path";

export class xmiUseCase extends xmiBase {
    scenarios: {type: string, steps: string[]}[];

    constructor(raw: any, parent?: xmiBase) {
        super(raw, parent);

        this.scenarios = get(raw, ['EAModel.scenario', '0', 'EAScenario'], [])
            .map((x: any) => ({
                type: x.$.name,
                steps: get(x, ['EAScenarioContent', '0', 'path', '0', 'step'], []).map((x: any) => x.$.name)
            }));
    }
}
