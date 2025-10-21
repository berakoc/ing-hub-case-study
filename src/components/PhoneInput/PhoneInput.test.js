import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import './PhoneInput.js';

vi.mock('./lib', () => ({ translate: (key) => key }));

describe('PhoneInput Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders label, input, and error message', async () => {
    const el = document.createElement('ing-phone-input');
    el.label = 'Phone';
    el.error = 'phone.required';
    container.appendChild(el);
    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const input = el.shadowRoot.querySelector('input[type="tel"]');
    const errorMsg = el.shadowRoot.querySelector('.error-message');

    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe('Phone');
    expect(input).toBeInTheDocument();
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg.textContent).toBe('phone.required');
  });

  it('applies error classes when error is set', async () => {
    const el = document.createElement('ing-phone-input');
    el.error = 'invalid';
    container.appendChild(el);
    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const input = el.shadowRoot.querySelector('input');

    expect(label).toHaveClass('error');
    expect(input).toHaveClass('error');
  });

  it('dispatches blur event', async () => {
    const el = document.createElement('ing-phone-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    const blurListener = vi.fn();
    el.addEventListener('blur', blurListener);

    fireEvent.blur(input);
    expect(blurListener).toHaveBeenCalled();
  });

  it('formats input to valid phone format', async () => {
    const el = document.createElement('ing-phone-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    const inputListener = vi.fn();
    el.addEventListener('input', inputListener);

    fireEvent.input(input, { target: { value: '+905321234567' } });

    expect(input.value).toBe('+(90) 532 123 45 67');
    expect(el.value).toBe('+(90) 532 123 45 67');
    expect(inputListener).toHaveBeenCalled();
  });

  it('keeps only one + and formats properly even with messy input', async () => {
    const el = document.createElement('ing-phone-input');
    container.appendChild(el);
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    fireEvent.input(input, { target: { value: '++9+0+53212+34567' } });

    expect(input.value).toBe('+(90) 532 123 45 67');
  });
});
