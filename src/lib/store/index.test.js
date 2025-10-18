import { describe, it, expect, beforeEach } from 'vitest';
import { store as actualStore } from './index';

describe('Store', () => {
  /**
   * @type {typeof actualStore}
   */
  let store;

  beforeEach(() => {
    store = actualStore;
    store.getState().actions.resetStore();
  });

  it('should initialize with default values', () => {
    const state = store.getState();
    expect(state.count).toBe(0);
  });

  it('should increment click count', () => {
    const {
      actions: { incrementCount },
    } = store.getState();
    incrementCount();
    expect(store.getState().count).toBe(1);
  });

  it('should reset click count', () => {
    const {
      actions: { incrementCount, resetCount },
    } = store.getState();
    incrementCount();
    incrementCount();
    resetCount();
    expect(store.getState().count).toBe(0);
  });
});
