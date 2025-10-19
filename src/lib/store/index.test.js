import { describe, it, expect, beforeEach } from 'vitest';
import { store as actualStore } from './index';

describe('Store', () => {
  /**
   * @type {typeof actualStore}
   */
  let store;

  const mockEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    position: 'Developer',
  };

  const mockEmployee2 = {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    position: 'Designer',
  };

  beforeEach(() => {
    store = actualStore;
    store.getState().resetStore({ employees: [] });
  });

  it('should initialize with empty employees array', () => {
    const state = store.getState();
    expect(state.employees).toEqual([]);
  });

  it('should add an employee', () => {
    const { addEmployee } = store.getState();

    addEmployee(mockEmployee);
    const state = store.getState();

    expect(state.employees).toHaveLength(1);
    expect(state.employees[0]).toEqual(mockEmployee);
  });

  it('should delete an employee', () => {
    const { addEmployee, deleteEmployee } = store.getState();

    addEmployee(mockEmployee);
    addEmployee(mockEmployee2);

    deleteEmployee(mockEmployee.id);
    const state = store.getState();

    expect(state.employees).toHaveLength(1);
    expect(state.employees[0]).toEqual(mockEmployee2);
  });

  it('should update an employee', () => {
    const { addEmployee, updateEmployee } = store.getState();

    addEmployee(mockEmployee);

    const updatedEmployee = { ...mockEmployee, firstName: 'Johnny' };
    updateEmployee(mockEmployee.id, updatedEmployee);

    const state = store.getState();
    const updatedEmployeeInStore = state.employees.find((emp) => emp.id === mockEmployee.id);
    expect(updatedEmployeeInStore.firstName).toBe('Johnny');
    expect(state.employees).toHaveLength(1);
  });

  it('should reset store to initial state', () => {
    const { addEmployee, resetStore } = store.getState();

    addEmployee(mockEmployee);
    addEmployee(mockEmployee2);

    resetStore({ employees: [] });
    const state = store.getState();

    expect(state.employees).toEqual([]);
  });
});
