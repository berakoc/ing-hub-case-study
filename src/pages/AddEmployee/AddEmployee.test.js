import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './AddEmployee.js';
import { Path, store } from '@/lib';
import { Router } from '@vaadin/router';
import { employeeSchema } from './AddEmployee.js';
import dayjs from 'dayjs';

vi.mock('@/lib', () => ({
  Path: { EmployeeList: '/employees' },
  store: {
    getState: vi.fn(() => ({
      employees: [{ email: 'existing@example.com', phone: '+(90) 555 555 55 55' }],
      addEmployee: vi.fn(),
    })),
  },
  translate: vi.fn((key) => key),
  parseDate: vi.fn((v) => new Date(v)),
  isEmailUnique: vi.fn((email, employees) => !employees.some((e) => e.email === email)),
  isPhoneNumberUnique: vi.fn((phone, employees) => !employees.some((e) => e.phone === phone)),
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
    let state = { value: '', meta: { isValid: true, errors: [] } };
    handleChangeSpy = vi.fn((v) => (state.value = v));
    handleBlurSpy = vi.fn();
    handleSubmitSpy = vi.fn();
    return {
      api: { handleSubmit: handleSubmitSpy },
      field: (config, renderer) => {
        return renderer({
          state,
          handleChange: handleChangeSpy,
          handleBlur: handleBlurSpy,
        });
      },
    };
  }),
}));

customElements.define(
  'ing-text-input',
  class extends HTMLElement {
    constructor() {
      super();
      this._value = '';
      this._error = null;
    }
    get value() {
      return this._value;
    }
    set value(v) {
      this._value = v;
    }
    get _error() {
      return this.__error;
    }
    set _error(v) {
      this.__error = v;
    }
  }
);

customElements.define(
  'ing-modern-date-input',
  class extends HTMLElement {
    constructor() {
      super();
      this._value = '';
      this._error = null;
    }
    get value() {
      return this._value;
    }
    set value(v) {
      this._value = v;
    }
    get _error() {
      return this.__error;
    }
    set _error(v) {
      this.__error = v;
    }
  }
);

customElements.define(
  'ing-phone-input',
  class extends HTMLElement {
    constructor() {
      super();
      this._value = '';
      this._error = null;
    }
    get value() {
      return this._value;
    }
    set value(v) {
      this._value = v;
    }
    get _error() {
      return this.__error;
    }
    set _error(v) {
      this.__error = v;
    }
  }
);

customElements.define(
  'ing-dropdown',
  class extends HTMLElement {
    constructor() {
      super();
      this._value = '';
      this._error = null;
    }
    get value() {
      return this._value;
    }
    set value(v) {
      this._value = v;
    }
    get _error() {
      return this.__error;
    }
    set _error(v) {
      this.__error = v;
    }
  }
);

customElements.define('ing-button', class extends HTMLElement {});

describe('<add-employee> full coverage', () => {
  let el, addEmployeeSpy, routerGoSpy;

  beforeEach(async () => {
    el = document.createElement('add-employee');
    document.body.appendChild(el);
    await el.updateComplete;
    addEmployeeSpy = store.getState().addEmployee;
    routerGoSpy = Router.go;
  });

  afterEach(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null;
    vi.clearAllMocks();
  });

  it('renders all inputs, dropdowns, and buttons', () => {
    const root = el.shadowRoot;
    expect(root.querySelectorAll('ing-text-input').length).toBe(4);
    expect(root.querySelectorAll('ing-phone-input').length).toBe(1);
    expect(root.querySelectorAll('ing-modern-date-input').length).toBe(2);
    expect(root.querySelectorAll('ing-dropdown').length).toBe(1);
    expect(root.querySelectorAll('ing-button').length).toBe(2);
  });

  const inputSelectors = [
    { id: 'firstName', tag: 'ing-text-input' },
    { id: 'lastName', tag: 'ing-text-input' },
    { id: 'dateOfEmployment', tag: 'ing-modern-date-input' },
    { id: 'dateOfBirth', tag: 'ing-modern-date-input' },
    { id: 'phone', tag: 'ing-phone-input' },
    { id: 'email', tag: 'ing-text-input' },
    { id: 'department', tag: 'ing-text-input' },
  ];

  inputSelectors.forEach(({ id }) => {
    it(`@input on ${id} triggers handleChange`, () => {
      const input = el.shadowRoot.querySelector(`#${id}`);
      input.dispatchEvent(
        new CustomEvent('input', {
          detail: { event: { target: { value: 'test' } } },
          bubbles: true,
          composed: true,
        })
      );
      expect(handleChangeSpy).toHaveBeenCalledWith('test');
    });
  });

  it('dropdown @value-change triggers handleChange', () => {
    const dropdown = el.shadowRoot.querySelector('ing-dropdown#position');
    dropdown.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: 'manager' },
        bubbles: true,
        composed: true,
      })
    );
    expect(handleChangeSpy).toHaveBeenCalledWith('manager');
  });

  it('cancel button calls Router.go', async () => {
    const cancelButton = el.shadowRoot.querySelectorAll('ing-button')[1];
    await fireEvent.click(cancelButton);
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });

  it('save button calls handleSubmit', () => {
    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('onSubmit triggers addEmployee and Router.go', () => {
    handleSubmitSpy.mockImplementation(() => {
      addEmployeeSpy({ firstName: 'John' });
      routerGoSpy(Path.EmployeeList);
    });
    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);
    expect(addEmployeeSpy).toHaveBeenCalledWith({ firstName: 'John' });
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });

  const today = dayjs().format('YYYY-MM-DD');

  it('fails if firstName too short', () => {
    const result = employeeSchema.safeParse({
      firstName: 'A',
      lastName: 'ValidLast',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: '2020-01-01',
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('employee.errors.firstNameMinError');
  });

  it('fails if lastName too short', () => {
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'X',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: '2020-01-01',
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('employee.errors.lastNameMinError');
  });

  it('fails if dateOfBirth is in the future', () => {
    const future = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: future,
      dateOfEmployment: today,
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some((i) => i.message === 'employee.errors.futureBirthDate')).toBe(
      true
    );
  });

  it('fails if dateOfEmployment is in the future', () => {
    const future = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: future,
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((i) => i.message === 'employee.errors.futureEmploymentDate')
    ).toBe(true);
  });

  it('fails if employmentDate is before birthDate', () => {
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: '1990-01-01',
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((i) => i.message === 'employee.errors.employmentBeforeBirth')
    ).toBe(true);
  });

  it('fails if age < 18', () => {
    const birth = dayjs().subtract(17, 'year').format('YYYY-MM-DD');
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: birth,
      dateOfEmployment: today,
      phone: '+(90) 555 555 55 56',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some((i) => i.message === 'employee.errors.mustBe18')).toBe(true);
  });

  it('fails if email is duplicate', () => {
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: today,
      phone: '+(90) 555 555 55 56',
      email: 'existing@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some((i) => i.message === 'employee.errors.duplicateEmail')).toBe(
      true
    );
  });

  it('fails if phone is duplicate', () => {
    const result = employeeSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      dateOfEmployment: today,
      phone: '+(90) 555 555 55 55',
      email: 'new@example.com',
      department: 'HR',
      position: 'dev',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues.some((i) => i.message === 'employee.errors.duplicatePhone')).toBe(
      true
    );
  });
});
