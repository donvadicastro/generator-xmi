export class FlowState {
    initialData: any;

    flowStart?: Date;
    flowEnd?: Date;

    actionStart: Date;
    actionEnd?: Date;

    resetFlowStart() {
        this.flowStart = new Date();
        return this;
    }

    resetActionStart() {
        this.actionStart = new Date();
        return this;
    }

    constructor(initialData: any = null) {
        this.initialData = initialData;
    }
}
