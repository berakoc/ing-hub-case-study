import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './TextInput.js';

vi.mock('@/lib', () => ({
  translate: vi.fn((key) => key),
}));

describe('TextInput Component', () => {
  let el, input, label, errorMessage;

  beforeEach(async () => {
    el = document.createElement('ing-text-input');
    el.label = 'Username';
    el.id = 'username';
    el.value = '';
    document.body.appendChild(el);
    await el.updateComplete;
    const root = el.shadowRoot;
    input = root.querySelector('input');
    label = root.querySelector('label');
    errorMessage = root.querySelector('.error-message');
  });

  afterEach(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    el = null;
    input = null;
    label = null;
    errorMessage = null;
  });

  it('renders input, label, and error message container', () => {
    expect(label).toHaveTextContent('Username');
    expect(input).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders correct type attribute (default "text")', () => {
    expect(input.getAttribute('type')).toBe('text');
  });

  it('renders type="email" when set', async () => {
    el.type = 'email';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input').getAttribute('type')).toBe('email');
  });

  it('dispatches input event with correct detail when typing', async () => {
    const listener = vi.fn();
    el.addEventListener('input', listener);

    input.value = 'John';
    fireEvent.input(input);
    await el.updateComplete;

    const customEvents = listener.mock.calls.map(([ev]) => ev).filter((ev) => ev.detail);

    expect(customEvents.length).toBe(1);
    const detail = customEvents[0].detail;
    expect(detail.event).toBeDefined();
    expect(detail.event.target.value).toBe('John');
  });

  it('dispatches blur event when input loses focus', async () => {
    const listener = vi.fn();
    el.addEventListener('blur', listener);

    await fireEvent.blur(input);
    await el.updateComplete;

    expect(listener).toHaveBeenCalledTimes(2);
    const detail = listener.mock.calls[0][0].detail;
    expect(detail.type).toBe('blur');
  });

  it('shows error message when error prop is set', async () => {
    el.error = 'form.error.required';
    await el.updateComplete;

    const updatedError = el.shadowRoot.querySelector('.error-message');
    expect(updatedError).toHaveTextContent('form.error.required');
  });

  it('applies "error" CSS class to label and input when error is set', async () => {
    el.error = 'form.error.invalid';
    await el.updateComplete;

    const root = el.shadowRoot;
    const labelNode = root.querySelector('label');
    const inputNode = root.querySelector('input');

    expect(labelNode.classList.contains('error')).toBe(true);
    expect(inputNode.classList.contains('error')).toBe(true);
  });
});
