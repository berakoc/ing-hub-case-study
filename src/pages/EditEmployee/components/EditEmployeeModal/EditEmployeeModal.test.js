import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './EditEmployeeModal.js';
import '@testing-library/jest-dom';

describe('EditEmployeeModal', () => {
  let el;
  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    el = document.createElement('edit-employee-modal');
    el.employeeFullname = 'John Doe';
    container.appendChild(el);

    await el.updateComplete;
  });

  afterEach(() => {
    if (container) container.remove();
    vi.clearAllMocks();
  });

  it('renders title, subtitle, and buttons', () => {
    const shadow = el.shadowRoot;

    const title = shadow.querySelector('.title');
    const subtitle = shadow.querySelector('.subtitle');
    const buttons = shadow.querySelectorAll('ing-button');

    expect(title).toHaveTextContent('editEmployee.editEmployeeModal.title');
    expect(subtitle).toHaveTextContent('editEmployee.editEmployeeModal.subtitle');
    expect(buttons.length).toBe(2);
  });

  it('dispatches edit-employee event when proceed button clicked', () => {
    const proceedButton = el.shadowRoot.querySelector('ing-button:first-of-type');
    const spy = vi.fn();
    el.addEventListener('edit-employee', spy);

    fireEvent.click(proceedButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispatches close-modal event when cancel button clicked', () => {
    const cancelButton = el.shadowRoot.querySelector('ing-button:last-of-type');
    const spy = vi.fn();
    el.addEventListener('close-modal', spy);

    fireEvent.click(cancelButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispatches close-modal event when close icon clicked', () => {
    const closeButton = el.shadowRoot.querySelector('.close-button');
    const spy = vi.fn();
    el.addEventListener('close-modal', spy);

    fireEvent.click(closeButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('respects isOpen property', async () => {
    el.isOpen = true;
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('ing-modal');
    expect(modal.hasAttribute('isOpen')).toBe(true);
  });
});
