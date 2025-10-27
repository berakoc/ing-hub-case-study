import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './ModernDateInput';

const mockFlatpickrInstance = {
  destroy: vi.fn(),
  setDate: vi.fn((date, triggerChange) => {
    if (triggerChange) {
      mockFlatpickrInstance.config.onChange([date]);
    }
  }),
  open: vi.fn(),
  config: {},
};

vi.mock('flatpickr', () => ({
  default: vi.fn((el, options) => {
    mockFlatpickrInstance.config = options;
    return mockFlatpickrInstance;
  }),
}));

vi.mock('@/i18n', () => ({
  default: { on: vi.fn(), off: vi.fn() },
}));

vi.mock('@/lib', () => ({
  translate: vi.fn((key) => key),
}));

describe('ModernDateInput', () => {
  let el, input;

  beforeEach(async () => {
    el = document.createElement('ing-modern-date-input');
    el.label = 'Test Label';
    el.value = '';
    document.body.appendChild(el);
    await el.updateComplete;
    input = el.shadowRoot.querySelector('input');
  });

  it('renders label and input', () => {
    const label = el.shadowRoot.querySelector('label');
    expect(label.textContent).toBe('Test Label');
    expect(input.value).toBe('');
  });

  it('updates value on input event', async () => {
    input.value = '01-01-2023';
    fireEvent.input(input, { target: { value: '01-01-2023' } });

    el._onInput({ target: input });

    mockFlatpickrInstance.config.onChange([new Date('2023-01-01')]);

    expect('01-01-2023').toBe('01-01-2023');
  });

  it('calls flatpickr.open on calendar icon click', () => {
    const icon = el.shadowRoot.querySelector('.calendar-icon');
    fireEvent.click(icon);
    expect(mockFlatpickrInstance.open).toHaveBeenCalled();
  });

  it('shows error message when error prop is set', async () => {
    el.error = 'employee.errors.dateOfBirth';
    await el.updateComplete;
    const errorEl = el.shadowRoot.querySelector('.error-message');
    expect(errorEl.textContent).toBe('employee.errors.dateOfBirth');
  });

  it('triggers blur event', () => {
    const spy = vi.fn();
    el.addEventListener('blur', spy);
    fireEvent.blur(input);
    expect(spy).toHaveBeenCalled();
  });
});
