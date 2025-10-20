import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import './DateInput';

vi.mock('@/lib', () => ({
  translate: (key) => key,
}));

describe('DateInput Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders input, label, and calendar icon', async () => {
    const el = document.createElement('ing-date-input');
    el.label = 'Date of Birth';
    container.appendChild(el);
    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const input = el.shadowRoot.querySelector('input[type="date"]');
    const icon = el.shadowRoot.querySelector('.calendar-icon');

    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe('Date of Birth');
    expect(input).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('sets max date to today', async () => {
    const el = document.createElement('ing-date-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input[type="date"]');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const expected = `${yyyy}-${mm}-${dd}`;

    expect(input.max).toBe(expected);
  });

  it('dispatches input event', async () => {
    const el = document.createElement('ing-date-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input[type="date"]');
    const listener = vi.fn();
    el.addEventListener('input', listener);

    await fireEvent.input(input, { target: { value: '2025-10-20' } });
    expect(listener).toHaveBeenCalled();

    const eventDetail = listener.mock.calls[0][0].detail;
    expect(eventDetail).toHaveProperty('event');
  });

  it('dispatches blur event', async () => {
    const el = document.createElement('ing-date-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input[type="date"]');
    const listener = vi.fn();
    el.addEventListener('blur', listener);

    await fireEvent.blur(input);
    expect(listener).toHaveBeenCalled();
  });

  it('renders error message', async () => {
    const el = document.createElement('ing-date-input');
    el.error = 'addEmployee.errors.emptyDateOfEmployment';
    container.appendChild(el);
    await el.updateComplete;

    const errorMsg = el.shadowRoot.querySelector('.error-message');
    expect(errorMsg).not.toBeNull();
    expect(errorMsg.textContent).toBe('addEmployee.errors.emptyDateOfEmployment');
  });

  it('adds error class to input and label', async () => {
    const el = document.createElement('ing-date-input');
    el.label = 'Test';
    el.error = 'someError';
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    const label = el.shadowRoot.querySelector('label');

    expect(input).toHaveClass('error');
    expect(label).toHaveClass('error');
  });
});
