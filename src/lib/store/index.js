import { createStore } from 'zustand/vanilla';

const initialState = {
  count: 0,
};

export const store = createStore(() => ({
  ...initialState,
  actions: {
    incrementCount: () => {
      store.setState((state) => ({ count: state.count + 1 }));
    },
    resetCount: () => {
      store.setState({ count: 0 });
    },
    resetStore: () => {
      store.setState({ ...initialState });
    },
  },
}));
