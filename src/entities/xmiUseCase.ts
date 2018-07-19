import xmiBase from "./xmiBase";
import {get} from "object-path";

export class xmiUseCase extends xmiBase {
    basicPathScenarios: string[];

    constructor(raw: any, parent: xmiBase | null) {
        super(raw, parent);
        this.basicPathScenarios = get(raw, ['EAModel.scenario', '0', 'EAScenario', '0', 'EAScenarioContent', '0', 'path', '0', 'step'], [])
            .map((x: any) => x.$.name);
    }
}