import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import './Dropdown.js';

vi.mock('@/lib', () => ({
  translate: (key) => key,
}));

describe('Dropdown Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders label, selected value, and error message', async () => {
    const el = document.createElement('ing-dropdown');
    el.label = 'Position';
    el.error = 'position.required';
    el.options = [{ value: 'manager', label: 'Manager' }];
    container.appendChild(el);
    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const selected = el.shadowRoot.querySelector('.selected');
    const errorMsg = el.shadowRoot.querySelector('.error-message');

    expect(label).toBeInstanceOf(HTMLElement);
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe('Position');

    expect(selected).toBeInstanceOf(HTMLElement);
    expect(selected).toBeInTheDocument();

    expect(errorMsg).toBeInstanceOf(HTMLElement);
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg.textContent).toBe('position.required');
  });

  it('opens and closes the menu when selected is clicked', async () => {
    const el = document.createElement('ing-dropdown');
    el.options = [
      { value: 'exec', label: 'Executive' },
      { value: 'manager', label: 'Manager' },
    ];
    container.appendChild(el);
    await el.updateComplete;

    const selected = el.shadowRoot.querySelector('.selected');
    expect(selected).toBeInstanceOf(HTMLElement);

    expect(el.open).toBe(false);
    let menu = el.shadowRoot.querySelector('.menu');
    expect(menu).toBeNull();

    await fireEvent.click(selected);
    await el.updateComplete;

    expect(el.open).toBe(true);
    menu = el.shadowRoot.querySelector('.menu');
    expect(menu).toBeInstanceOf(HTMLElement);
    expect(menu).toBeInTheDocument();

    await fireEvent.click(selected);
    await el.updateComplete;

    expect(el.open).toBe(false);
    menu = el.shadowRoot.querySelector('.menu');
    expect(menu).toBeNull();
  });

  it('selects an option and dispatches events', async () => {
    const el = document.createElement('ing-dropdown');
    el.options = [
      { value: 'exec', label: 'Executive' },
      { value: 'manager', label: 'Manager' },
    ];
    container.appendChild(el);
    await el.updateComplete;

    const selected = el.shadowRoot.querySelector('.selected');
    const changeListener = vi.fn();
    const valueChangeListener = vi.fn();

    el.addEventListener('change', changeListener);
    el.addEventListener('value-change', valueChangeListener);

    await fireEvent.click(selected);
    await el.updateComplete;

    const firstOption = el.shadowRoot.querySelector('.option');
    await fireEvent.click(firstOption);
    await el.updateComplete;

    expect(el.value).toBe('exec');
    expect(el.open).toBe(false);

    expect(changeListener).toHaveBeenCalled();
    expect(valueChangeListener).toHaveBeenCalled();
    expect(valueChangeListener.mock.calls[0][0].detail.value).toBe('exec');
  });

  it('renders the selected label correctly', async () => {
    const el = document.createElement('ing-dropdown');
    el.options = [
      { value: 'exec', label: 'Executive' },
      { value: 'manager', label: 'Manager' },
    ];
    el.value = 'manager';
    container.appendChild(el);
    await el.updateComplete;

    const selected = el.shadowRoot.querySelector('.selected');
    expect(selected.textContent).toContain('Manager');
  });

  it('adds error class when error is set', async () => {
    const el = document.createElement('ing-dropdown');
    el.error = 'someError';
    el.options = [{ value: 'exec', label: 'Executive' }];
    container.appendChild(el);
    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const selected = el.shadowRoot.querySelector('.selected');

    expect(label).toHaveClass('error');
    expect(selected).toHaveClass('error');
  });
});
