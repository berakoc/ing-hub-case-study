import { translate } from '@/lib';
import { LitElement, html, css } from 'lit';

export class TextInput extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      id: { type: String },
      error: { type: String },
      type: { type: String },
    };
  }

  constructor() {
    super();
    /**
     * @type {'text' | 'email'}
     */
    this.type = 'text';
  }

  _onBlur(event) {
    this.dispatchEvent(
      new CustomEvent('blur', {
        detail: event,
        composed: true,
        bubbles: true,
      })
    );
  }

  _onInput(event) {
    event.stopPropagation();
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          event,
        },
        composed: true,
        bubbles: true,
      })
    );
  }

  render() {
    return html`<div class="container">
      <label class=${`${this.error && 'error'}`}>${this.label}</label>
      <input
        @blur=${this._onBlur}
        @input=${this._onInput}
        id=${this.id}
        value=${this.value}
        type=${this.type}
        class=${`${this.error && 'error'}`}
      />
      <div class="error-message">${translate(this.error)}</div>
    </div>`;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      input {
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid var(--color-text-secondary);
        padding: 4px 12px;
        outline: none;
      }

      input.error {
        border: 1px solid var(--color-error);
      }

      input.error:focus {
        border: 2px solid var(--color-error);
      }

      input:focus {
        border: 2px solid var(--color-text-primary);
      }

      label {
        font-size: 14px;
        color: var(--color-text-primary);
      }

      label.error {
        color: var(--color-error);
      }

      .error-message {
        font-size: 12px;
        color: var(--color-error);
      }
    `;
  }
}

window.customElements.define('ing-text-input', TextInput);
