"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowState = void 0;
class FlowState {
    constructor(initialData = null) {
        this.stack = [initialData];
    }
    resetFlowStart() {
        this.flowStart = new Date();
        return this;
    }
    resetActionStart() {
        this.actionStart = new Date();
        return this;
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