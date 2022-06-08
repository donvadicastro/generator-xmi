"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowState {
    resetFlowStart() {
        this.flowStart = new Date();
        return this;
    }
    resetActionStart() {
        this.actionStart = new Date();
        return this;
    }
    constructor(initialData = null) {
        this.stack = [initialData];
    }
    get value() {
        return this.stack.pop();
    }
    set value(value) {
        this.stack.push(value);
    }
}
exports.FlowState = FlowState;
//# sourceMappingURL=flowState.js.map