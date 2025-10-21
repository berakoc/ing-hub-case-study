import { createStore } from 'zustand/vanilla';
import { employees } from './data';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

const initialState = {
  employees,
};

export const store = createStore(
  devtools(
    persist(
      () => ({
        ...initialState,
        addEmployee: (employee) => {
          store.setState((state) => ({
            employees: [...state.employees, employee],
          }));
        },
        updateEmployee: (updatedData) => {
          const employeeId = updatedData.id;
          store.setState((state) => ({
            employees: state.employees.map((employee) =>
              employee.id === employeeId ? { ...employee, ...updatedData } : employee
            ),
          }));
        },
        deleteEmployee: (employeeId) => {
          store.setState((state) => ({
            employees: state.employees.filter((employee) => employee.id !== employeeId),
          }));
        },
        /**
         * @param {typeof initialState} givenInitialState
         */
        resetStore: (givenInitialState) => {
          store.setState(givenInitialState ? { ...givenInitialState } : { ...initialState });
        },
      }),
      {
        name: 'ing-hub-store',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
