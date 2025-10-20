import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './AddEmployee.js';
import { Path, store } from '@/lib';
import { Router } from '@vaadin/router';

vi.mock('@/lib', () => ({
  Path: { EmployeeList: '/employees' },
  store: {
    getState: vi.fn(() => ({
      addEmployee: vi.fn(),
    })),
  },
  translate: vi.fn((key) => key),
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

customElements.define(
  'ing-text-input',
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
customElements.define(
  'ing-date-input',
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
customElements.define(
  'ing-dropdown',
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
customElements.define('ing-button', class extends HTMLElement {});

describe('<add-employee> full coverage tests', () => {
  let el;
  let addEmployeeSpy;
  let routerGoSpy;

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
    expect(root.querySelectorAll('ing-text-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-date-input').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('ing-dropdown').length).toBe(1);
    expect(root.querySelectorAll('ing-button').length).toBe(2);
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
    it(`@input on ${id} triggers handleChange`, async () => {
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

    it(`@blur on ${id} triggers handleBlur`, async () => {
      const input = el.shadowRoot.querySelector(`#${id}`);
      input.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
      expect(handleBlurSpy).toHaveBeenCalled();
    });
  });

  it('dropdown @value-change triggers handleChange', async () => {
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

  it('save button calls TanStackFormController.handleSubmit', async () => {
    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);
    expect(handleSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it('onSubmit triggers addEmployee and Router.go', async () => {
    handleSubmitSpy.mockImplementation(() => {
      addEmployeeSpy({ firstName: 'John' });
      routerGoSpy(Path.EmployeeList);
    });
    const saveButton = el.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(saveButton);
    expect(addEmployeeSpy).toHaveBeenCalledWith({ firstName: 'John' });
    expect(routerGoSpy).toHaveBeenCalledWith('/employees');
  });
});
