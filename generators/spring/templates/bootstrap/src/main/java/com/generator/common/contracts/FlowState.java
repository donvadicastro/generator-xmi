package com.generator.common.contracts;

import lombok.Data;

import java.util.*;

@Data
public class FlowState {
    private Deque<Object> stack = new ArrayDeque<>();
    private List<String> history = new ArrayList<>();

    private Date flowStart;
    private Date flowEnd;

    private Date actionStart;
    private Date actionEnd;

    public FlowState resetFlowStart() {
        this.flowStart = new Date();
        return this;
    }

    public FlowState resetActionStart() {
        this.actionStart = new Date();
        return this;
    }

    public FlowState(Object initialData) {
        this.stack.push(initialData);
    }

    public Object getValue() {
        return this.stack.isEmpty() ? null : this.stack.pop();
    }

    public void setValue(Object value) {
        this.stack.push(value);
    }
}
