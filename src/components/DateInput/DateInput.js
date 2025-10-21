import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhCalendar';
import { translate } from '@/lib';

export class DateInput extends LitElement {
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

  firstUpdated() {
    const input = this.renderRoot.querySelector('input[type="date"]');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    input.max = `${yyyy}-${mm}-${dd}`;
  }

  render() {
    return html`<div class="container">
      <label class=${`${this.error && 'error'}`} ="">${this.label}</label>
      <div class="input-wrapper">
        <input
          @blur=${this._onBlur}
          @input=${this._onInput}
          id=${this.id}
          value=${this.value}
          type="date"
          class=${`${this.error && 'error'}`}
        />
        <div class="calendar-icon"><ph-calendar size="16" weight="fill"></ph-calendar></div>
      </div>
      <div class="error-message">${translate(this.error)}</div>
    </div>`;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background-color: var(--color-white);
      }

      .input-wrapper {
        position: relative;
        width: 100%;
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
        font-family: unset;
        background-color: white;
        appearance: none;
      }

      input[type='date']::-webkit-calendar-picker-indicator {
        opacity: 0;
        display: block;
        width: 1em;
        height: 1em;
        cursor: pointer;
      }

      input[type='date']::-moz-calendar-picker-indicator {
        display: none;
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

      .calendar-icon {
        position: absolute;
        right: 15px;
        top: 21%;
        color: var(--color-ing-orange);
        pointer-events: none;
        cursor: pointer;
      }
    `;
  }
}

window.customElements.define('ing-date-input', DateInput);
