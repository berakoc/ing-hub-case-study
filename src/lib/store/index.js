import { createStore } from "zustand/vanilla";

export const store = createStore(() => ({
  count: 4,
}));
