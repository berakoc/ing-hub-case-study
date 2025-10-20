import { LitElement, html, css } from 'lit';
import { ButtonVariant } from './common';

export class Button extends LitElement {
  static get properties() {
    return {
      variant: { type: String },
      type: { type: String },
    };
  }

  constructor() {
    super();
    this.variant = ButtonVariant.Primary;
    this.onClick = () => {};
    /**
     * @type {'submit' | 'button' | 'reset'}
     */
    this.type = 'submit';
  }

  render() {
    return html`<button .type=${this.type} @click=${this._handleClick} class=${this.variant}>
      <slot></slot>
    </button>`;
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('button-click', { bubbles: true, composed: true }));
  }

  static get styles() {
    return css`
      button {
        width: var(--button-width, 100%);
        display: flex;
        align-items: center;
        justify-content: center;
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
        border: 2px solid var(--color-ing-orange);
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
        border: 2px solid var(--color-ing-dark-blue);
      }
      .secondary:hover {
        background-color: var(--color-ing-dark-blue-hover);
      }
      .secondary:active {
        background-color: var(--color-ing-dark-blue-active);
        transform: scale(0.95);
      }

      .tertiary {
        background-color: var(--color-white);
        color: var(--color-ing-dark-blue);
        border: 2px solid var(--color-ing-dark-blue);
      }
      .tertiary:hover {
        color: var(--color-ing-dark-blue);
      }
      .tertiary:active {
        transform: scale(0.95);
      }
    `;
  }
}

window.customElements.define('ing-button', Button);
