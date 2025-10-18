import { LitElement, html, css } from 'lit';

export class Button extends LitElement {
  static get properties() {
    return {
      variant: { type: String },
    };
  }

  constructor() {
    console.log('Button component initialized');
    super();
    this.variant = 'primary';
    this.onClick = () => {};
  }

  render() {
    return html`<button @click=${this._handleClick} class=${this.variant}>
      <slot></slot>
    </button>`;
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));
  }

  static get styles() {
    return css`
      button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        padding: 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }
      .primary {
        background-color: var(--color-ing-orange);
        color: var(--color-white);
      }
      .primary:hover {
        background-color: var(--color-ing-orange-hover);
      }
      .primary:active {
        background-color: var(--color-ing-orange-active);
        transform: scale(0.95);
      }
      .secondary {
        background-color: var(--color-ing-dark-blue);
        color: var(--color-white);
      }
      .secondary:hover {
        background-color: var(--color-ing-dark-blue-hover);
      }
      .secondary:active {
        background-color: var(--color-ing-dark-blue-active);
        transform: scale(0.95);
      }
    `;
  }
}

window.customElements.define('ing-button', Button);
