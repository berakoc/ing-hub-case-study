import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './Checkbox.js';

describe('<ing-checkbox>', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('ing-checkbox');
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders the component', () => {
    const button = el.shadowRoot.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    const button = el.shadowRoot.querySelector('button');
    expect(button.classList.contains('checked')).toBe(false);
    expect(el.checked).toBe(false);
    expect(el.shadowRoot.querySelector('ph-check')).toBeNull();
  });

  it('toggles checked state when clicked', async () => {
    const button = el.shadowRoot.querySelector('button');

    fireEvent.click(button);
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(button.classList.contains('checked')).toBe(true);
    expect(el.shadowRoot.querySelector('ph-check')).toBeInTheDocument();

    fireEvent.click(button);
    await el.updateComplete;

    expect(el.checked).toBe(false);
    expect(button.classList.contains('checked')).toBe(false);
    expect(el.shadowRoot.querySelector('ph-check')).toBeNull();
  });

  it('applies correct classes for visual state', async () => {
    const button = el.shadowRoot.querySelector('button');

    expect(button).toHaveClass('container');
    expect(button).not.toHaveClass('checked');

    fireEvent.click(button);
    await el.updateComplete;
    expect(button).toHaveClass('checked');

    fireEvent.click(button);
    await el.updateComplete;
    expect(button).not.toHaveClass('checked');
  });

  it('renders the check icon only when checked', async () => {
    let icon = el.shadowRoot.querySelector('ph-check');
    expect(icon).toBeNull();

    fireEvent.click(el.shadowRoot.querySelector('button'));
    await el.updateComplete;

    icon = el.shadowRoot.querySelector('ph-check');
    expect(icon).toBeInTheDocument();

    fireEvent.click(el.shadowRoot.querySelector('button'));
    await el.updateComplete;

    icon = el.shadowRoot.querySelector('ph-check');
    expect(icon).toBeNull();
  });
});
