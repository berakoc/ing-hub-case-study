import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './DeleteEmployeeModal';

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key, options) => {
      if (options?.employeeFullname) {
        return `${key}-${options.employeeFullname}`;
      }
      return key;
    }),
  };
});

describe('DeleteEmployeeModal', () => {
  let container;
  let modal;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<delete-employee-modal></delete-employee-modal>`;
    modal = container.querySelector('delete-employee-modal');
    modal.isOpen = true;
    modal.employeeFullname = 'John Doe';
    await modal.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders modal with employee fullname', async () => {
    await modal.updateComplete;
    const subtitle = modal.shadowRoot.querySelector('.subtitle');
    expect(subtitle.textContent).toContain('employeeList.deleteEmployeeModal.subtitle-John Doe');
  });

  it('dispatches "delete-employee" when proceed button is clicked', async () => {
    const spy = vi.fn();
    modal.addEventListener('delete-employee', spy);

    const proceedButton = modal.shadowRoot.querySelectorAll('ing-button')[0];
    fireEvent.click(proceedButton);
    await modal.updateComplete;

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close-modal" when cancel button is clicked', async () => {
    const spy = vi.fn();
    modal.addEventListener('close-modal', spy);

    const cancelButton = modal.shadowRoot.querySelectorAll('ing-button')[1];
    fireEvent.click(cancelButton);
    await modal.updateComplete;

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close-modal" when close X button is clicked', async () => {
    const spy = vi.fn();
    modal.addEventListener('close-modal', spy);

    const closeButton = modal.shadowRoot.querySelector('.close-button');
    fireEvent.click(closeButton);
    await modal.updateComplete;

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
