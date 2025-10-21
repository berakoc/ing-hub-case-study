import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Path, store } from '@/lib';
import { Router } from '@vaadin/router';
import './EditEmployee';

const mockEmployee = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Johnson',
  dateOfEmployment: '2021-01-15',
  dateOfBirth: '1990-05-22',
  phone: '+905555555555',
  email: 'alice.johnson@example.com',
  department: 'HR',
  position: 'manager',
};

vi.mock('@/lib', () => ({
  Path: { EmployeeList: '/employees' },
  store: {
    getState: vi.fn(() => ({
      updateEmployee: vi.fn(),
      employees: [mockEmployee],
    })),
  },
  translate: vi.fn((key) => key),
  getEmployeeFullname: vi.fn((employee) => `${employee.firstName} ${employee.lastName}`),
}));

vi.mock('@vaadin/router', () => ({
  Router: { go: vi.fn() },
}));

vi.mock('@/lib/store/data', () => ({
  employeePositions: [
    { labelKey: 'employee.position.manager', value: 'manager' },
    { labelKey: 'employee.position.dev', value: 'dev' },
  ],
}));

let handleChangeSpy, handleBlurSpy, handleSubmitSpy;

vi.mock('@tanstack/lit-form', () => ({
  TanStackFormController: vi.fn().mockImplementation(() => {
    const state = { value: '', meta: { isValid: true, errors: [] } };
    handleChangeSpy = vi.fn((v) => (state.value = v));
    handleBlurSpy = vi.fn();
    handleSubmitSpy = vi.fn();
    return {
      api: { handleSubmit: handleSubmitSpy },
      field: (config, renderer) =>
        renderer({
          state,
          handleChange: handleChangeSpy,
          handleBlur: handleBlurSpy,
        }),
    };
  }),
}));

// Stub elements safely only if not defined
const stubElement = (tag) => {
  if (!customElements.get(tag)) {
    customElements.define(
      tag,
      class extends HTMLElement {
        constructor() {
          super();
          this._value = '';
        }
        get value() {
          return this._value;
        }
        set value(v) {
          this._value = v;
        }
      }
    );
  }
};

['ing-text-input', 'ing-date-input', 'ing-dropdown', 'ing-button'].forEach(stubElement);

describe('Edit Employee Test Suite', () => {
  let el;
  let updateEmployeeSpy;
  let routerGoSpy;

  beforeEach(async () => {
    el = document.createElement('edit-employee');
    document.body.appendChild(el);

    const location = { params: { employeeId: '1' } };
    el.onBeforeEnter(location);

    await el.updateComplete;
    updateEmployeeSpy = store.getState().updateEmployee;
    routerGoSpy = Router.go;
  });

  afterEach(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null;
    vi.clearAllMocks();
  });

  it('renders all inputs, dropdowns, and buttons', () => {
    const root = el.shadowRoot;
    expect(root.querySelectorAll('ing-text-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-date-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-dropdown').length).toBe(1);
    expect(root.querySelectorAll('ing-button').length).toBe(2);
  });

  it('preloads the employee data correctly', () => {
    expect(el.employee).toEqual(mockEmployee);
  });

  const inputIds = [
    'firstName',
    'lastName',
    'dateOfEmployment',
    'dateOfBirth',
    'phone',
    'email',
    'department',
  ];

  inputIds.forEach((id) => {
    it(`fires @input for #${id} → handleChange`, async () => {
      const input = el.shadowRoot.querySelector(`#${id}`);
      input.dispatchEvent(
        new CustomEvent('input', {
          detail: { event: { target: { value: 'newValue' } } },
          bubbles: true,
          composed: true,
        })
      );
      expect(handleChangeSpy).toHaveBeenCalledWith('newValue');
    });

    it(`fires @blur for #${id} → handleBlur`, async () => {
      const input = el.shadowRoot.querySelector(`#${id}`);
      input.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
      expect(handleBlurSpy).toHaveBeenCalled();
    });
  });

  it('dropdown @value-change triggers handleChange', async () => {
    const dropdown = el.shadowRoot.querySelector('ing-dropdown#position');
    dropdown.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: 'dev' },
        bubbles: true,
        composed: true,
      })
    );
    expect(handleChangeSpy).toHaveBeenCalledWith('dev');
  });

  it('cancel button calls Router.go', async () => {
    const cancelButton = el.shadowRoot.querySelectorAll('ing-button')[1];
    fireEvent.click(cancelButton);
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });

  it('save button triggers TanStackFormController.handleSubmit via modal', async () => {
    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);

    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('edit-employee-modal');
    expect(modal).toBeInTheDocument();

    const modalConfirmButton = modal.shadowRoot.querySelector('ing-button');
    fireEvent.click(modalConfirmButton);

    expect(handleSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it('onSubmit triggers updateEmployee and Router.go', async () => {
    handleSubmitSpy.mockImplementation(() => {
      updateEmployeeSpy({ id: '1', firstName: 'Updated' });
      routerGoSpy(Path.EmployeeList);
    });

    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('edit-employee-modal');
    const confirmButton = modal.shadowRoot.querySelector('ing-button');
    fireEvent.click(confirmButton);

    expect(updateEmployeeSpy).toHaveBeenCalledWith({ id: '1', firstName: 'Updated' });
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });
});
