package com.generator.common.contracts;

/**
 * Ensure entity has an identifier of specific type.
 * @param <T> identifier type.
 */
public interface Identifiable<T> {
    T getId();
}
