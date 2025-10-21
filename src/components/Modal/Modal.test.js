import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import './Modal';

describe('Modal component', () => {
  let container;
  let modal;
  let fakeDialog;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<ing-modal></ing-modal>`;
    modal = container.querySelector('ing-modal');

    await modal.updateComplete;

    fakeDialog = {
      open: false,
      showModal: vi.fn(function () {
        this.open = true;
      }),
      close: vi.fn(function () {
        this.open = false;
      }),
    };
    modal.shadowRoot.querySelector = vi.fn(() => fakeDialog);

    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('opens the dialog when isOpen is true', async () => {
    modal.isOpen = true;
    await modal.updateComplete;

    expect(fakeDialog.showModal).toHaveBeenCalled();
  });

  it('closes the dialog when isOpen is false', async () => {
    modal.isOpen = true;
    await modal.updateComplete;

    modal.isOpen = false;
    await modal.updateComplete;

    expect(fakeDialog.close).toHaveBeenCalled();
  });
});
