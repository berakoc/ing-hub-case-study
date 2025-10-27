import { LitElement, html, css } from 'lit';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '@phosphor-icons/webcomponents/PhCalendar';
import { translate } from '@/lib';
import { Turkish } from 'flatpickr/dist/l10n/tr.js';
import { English } from 'flatpickr/dist/l10n/default.js';
import i18next from '@/i18n';

export class ModernDateInput extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      id: { type: String },
      error: { type: String },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.flatpickrInstance = null;
  }

  firstUpdated() {
    this._initFlatpickr();

    i18next.on('languageChanged', (lng) => {
      this._updateFlatpickrLocale(lng);
    });
  }

  _initFlatpickr(locale) {
    const input = this.renderRoot.querySelector('input');
    const today = new Date();

    this.flatpickrInstance?.destroy();

    const selectedLocale = locale === 'tr' ? Turkish : English;

    this.flatpickrInstance = flatpickr(input, {
      dateFormat: 'm-d-Y',
      maxDate: today,
      locale: selectedLocale,
      defaultDate: this.value || null,
      onChange: ([selectedDate]) => {
        this.value = selectedDate;
        this.dispatchEvent(
          new CustomEvent('input', { detail: { value: selectedDate.toString() } })
        );
      },
    });
  }

  updated(changedProps) {
    if (changedProps.has('value') && this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.value, false);
    }
  }

  _updateFlatpickrLocale(lng) {
    this._initFlatpickr(lng);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.flatpickrInstance?.destroy();
    i18next.off('languageChanged');
  }

  _onBlur(event) {
    this.dispatchEvent(new CustomEvent('blur', { detail: event, composed: true, bubbles: true }));
  }

  _onInput(event) {
    this.dispatchEvent(
      new CustomEvent('input', { detail: { event }, composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <div class="container">
        <label class=${this.error ? 'error' : ''}>${this.label}</label>
        <div class="input-wrapper">
          <input
            id=${this.id}
            type="text"
            .value=${this.value}
            class=${this.error ? 'error' : ''}
            @blur=${this._onBlur}
            @input=${this._onInput}
            placeholder="MM-DD-YYYY"
          />
          <div class="calendar-icon" @click=${() => this.flatpickrInstance.open()}>
            <ph-calendar size="16" weight="fill"></ph-calendar>
          </div>
        </div>
        ${this.error ? html`<div class="error-message">${translate(this.error)}</div>` : ''}
      </div>
    `;
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
        cursor: pointer;
      }
    `;
  }
}

window.customElements.define('ing-modern-date-input', ModernDateInput);
