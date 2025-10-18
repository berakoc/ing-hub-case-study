import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import './Button.js';
import { ButtonVariant } from './common.js';

describe('Button Component', () => {
  it('renders with default properties', () => {
    document.body.innerHTML = '<ing-button>Click me</ing-button>';
    const button = document.querySelector('ing-button');
    expect(button).toBeInTheDocument();
    expect(button.shadowRoot).toBeTruthy();
    expect(button.textContent).toBe('Click me');
  });

  it('renders with custom properties', () => {
    document.body.innerHTML = '<ing-button variant="secondary">Submit</ing-button>';
    const button = document.querySelector('ing-button');
    expect(button.getAttribute('variant')).toBe('secondary');
    expect(button.textContent).toBe('Submit');
  });

  it('emits button-click event when clicked', async () => {
    document.body.innerHTML = '<ing-button>Click me</ing-button>';
    const button = document.querySelector('ing-button');

    await window.customElements.whenDefined('ing-button');

    const shadowButton = button.shadowRoot.querySelector('button');
    const mockCallback = vi.fn();

    button.addEventListener('button-click', mockCallback);
    shadowButton.click();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles based on variant', async () => {
    document.body.innerHTML = '<ing-button variant="primary">Click me</ing-button>';
    const button = document.querySelector('ing-button');
    await window.customElements.whenDefined('ing-button');
    const shadowButton = button.shadowRoot.querySelector('button');

    expect(shadowButton).toHaveClass('primary');
  });

  it('should initialize the correct button variants', () => {
    expect(ButtonVariant.Primary).toBe('primary');
    expect(ButtonVariant.Secondary).toBe('secondary');
    expect(Object.keys(ButtonVariant).length).toBe(2);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
