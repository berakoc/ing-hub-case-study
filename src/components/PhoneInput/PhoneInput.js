import { translate } from '@/lib';
import { LitElement, html, css } from 'lit';

export class PhoneInput extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      id: { type: String },
      error: { type: String },
    };
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
    const input = event.target;
    let raw = input.value;

    raw = raw.replace(/[^\d+]/g, '');

    if (raw.startsWith('+')) {
      raw = '+' + raw.slice(1).replace(/\+/g, '');
    }

    const digits = raw.replace(/[^\d]/g, '');

    let formatted = '+';
    if (digits.length > 0) {
      const countryCode = digits.substring(0, 2);
      formatted += `(${countryCode})`;
    }

    const rest = digits.substring(2);

    if (rest.length > 0) {
      const part1 = rest.substring(0, 3);
      const part2 = rest.substring(3, 6);
      const part3 = rest.substring(6, 8);
      const part4 = rest.substring(8, 10);

      formatted +=
        (part1 ? ' ' + part1 : '') +
        (part2 ? ' ' + part2 : '') +
        (part3 ? ' ' + part3 : '') +
        (part4 ? ' ' + part4 : '');
    }

    input.value = formatted.trim();
    this.value = input.value;

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { event },
        composed: true,
        bubbles: true,
      })
    );
  }

  render() {
    return html`<div class="container">
      <label class=${`${this.error && 'error'}`} ="">${this.label}</label>
      <input
        @blur=${this._onBlur}
        @input=${this._onInput}
        id=${this.id}
        value=${this.value}
        type="tel"
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

window.customElements.define('ing-phone-input', PhoneInput);
