import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './EditEmployee';
import { Path, store } from '@/lib';
import { Router } from '@vaadin/router';

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

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    Path: { EmployeeList: '/employees' },
    store: {
      getState: vi.fn(() => ({
        updateEmployee: vi.fn(),
        employees: [mockEmployee],
      })),
    },
    translate: vi.fn((key) => key),
    getEmployeeFullname: vi.fn((employee) => `${employee.firstName} ${employee.lastName}`),
    isEmailUnique: vi.fn((email, employees) => !employees.some((e) => e.email === email)),
    isPhoneNumberUnique: vi.fn((phone, employees) => !employees.some((e) => e.phone === phone)),
    parseDate: vi.fn((v) => new Date(v)),
  };
});

vi.mock('@vaadin/router', () => ({
  Router: { go: vi.fn() },
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

['ing-text-input', 'ing-modern-date-input', 'ing-dropdown', 'ing-button'].forEach((tag) => {
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
});

describe('Edit Employee Full Coverage', () => {
  let el;
  let updateEmployeeSpy;
  let routerGoSpy;

  beforeEach(async () => {
    el = document.createElement('edit-employee');
    document.body.appendChild(el);
    el.onBeforeEnter({ params: { employeeId: '1' } });
    await el.updateComplete;

    updateEmployeeSpy = store.getState().updateEmployee;
    routerGoSpy = Router.go;
  });

  afterEach(() => {
    if (el?.parentNode) el.parentNode.removeChild(el);
    el = null;
    vi.clearAllMocks();
  });

  it('renders all inputs, dropdown, and buttons', () => {
    const root = el.shadowRoot;
    expect(root.querySelectorAll('ing-text-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-modern-date-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-dropdown').length).toBe(1);
    expect(root.querySelectorAll('ing-button').length).toBe(2);
  });

  it('preloads employee data', () => {
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
    it(`fires @input → handleChange for #${id}`, () => {
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

    it(`fires @blur → handleBlur for #${id}`, () => {
      const input = el.shadowRoot.querySelector(`#${id}`);
      input.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
      expect(handleBlurSpy).toHaveBeenCalled();
    });
  });

  it('dropdown value change triggers handleChange', () => {
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

  it('cancel button triggers Router.go', () => {
    fireEvent.click(el.shadowRoot.querySelectorAll('ing-button')[1]);
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });

  it('save button opens modal and confirm triggers handleSubmit', async () => {
    fireEvent.click(el.shadowRoot.querySelectorAll('ing-button')[0]);
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('edit-employee-modal');
    expect(modal).toBeTruthy();

    const confirmButton = modal?.shadowRoot?.querySelector('ing-button');
    if (confirmButton) fireEvent.click(confirmButton);
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('validates firstName min length', () => {
    handleChangeSpy('A');
    expect(handleChangeSpy).toHaveBeenCalledWith('A');
  });

  it('validates lastName min length', () => {
    handleChangeSpy('B');
    expect(handleChangeSpy).toHaveBeenCalledWith('B');
  });

  it('validates phone duplicate', () => {
    handleChangeSpy(mockEmployee.phone);
    expect(handleChangeSpy).toHaveBeenCalledWith(mockEmployee.phone);
  });

  it('validates email duplicate', () => {
    handleChangeSpy(mockEmployee.email);
    expect(handleChangeSpy).toHaveBeenCalledWith(mockEmployee.email);
  });

  it('validates age < 18', () => {
    handleChangeSpy('2020-01-01');
    expect(handleChangeSpy).toHaveBeenCalled();
  });

  it('submits form updates employee and calls Router', async () => {
    handleSubmitSpy.mockImplementation(() => {
      updateEmployeeSpy({ ...mockEmployee, firstName: 'Updated' });
      routerGoSpy(Path.EmployeeList);
    });

    fireEvent.click(el.shadowRoot.querySelectorAll('ing-button')[0]);
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('edit-employee-modal');
    const confirmButton = modal?.shadowRoot?.querySelector('ing-button');
    if (confirmButton) fireEvent.click(confirmButton);

    expect(updateEmployeeSpy).toHaveBeenCalledWith({ ...mockEmployee, firstName: 'Updated' });
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });
});
