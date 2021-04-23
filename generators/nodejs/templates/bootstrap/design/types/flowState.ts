export class FlowState {
    stack: any[];

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
        this.stack = [initialData];
    }

    get value(): any {
        return this.stack.pop();
    }

    set value(value: any) {
        this.stack.push(value);
    }
}
