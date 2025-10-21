import { LitElement, html, css } from 'lit';

export class Modal extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.isOpen = false;
  }

  updated(changedProps) {
    if (changedProps.has('isOpen')) {
      const dialog = this.renderRoot.querySelector('dialog');
      if (this.isOpen && !dialog.open) {
        dialog.showModal?.();
      } else if (!this.isOpen && dialog.open) {
        dialog.close();
      }
    }
  }

  render() {
    return html`
      <dialog>
        <slot></slot>
      </dialog>
    `;
  }

  static get styles() {
    return css`
      dialog {
        border: none;
        border-radius: 4px;
        padding: 12px;
        background: rgba(255, 255, 255);
        color: black;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        font-size: 1rem;
        position: fixed;
      }

      dialog::backdrop {
        background: rgba(0, 0, 0, 0.2);
      }
    `;
  }
}

customElements.define('ing-modal', Modal);
