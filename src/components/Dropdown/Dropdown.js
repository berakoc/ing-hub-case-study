import { translate } from '@/lib';
import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhCaretDown';

export class Dropdown extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
      value: { type: String },
      open: { type: Boolean },
      label: { type: String },
    };
  }

  constructor() {
    super();
    this.options = [];
    this.value = '';
    this.open = false;
  }

  handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  _toggleOpen() {
    this.open = !this.open;
  }

  _selectOption(option) {
    this.value = option.value;
    this.open = false;

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('value-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const selectedLabel =
      this.options.find((o) => o.value === this.value)?.label || translate('pleaseSelect');

    return html`
      <div class="container">
        <label class=${`${this.error && 'error'}`}>${this.label}</label>
        <div class="dropdown">
          <div
            class="selected ${this.open ? 'open' : ''} ${this.error && 'error'}"
            @click=${this._toggleOpen}
          >
            ${selectedLabel}
            <span class="arrow ${this.open ? 'open' : ''}">
              <ph-caret-down weight="bold"></ph-caret-down>
            </span>
          </div>
          <div class="error-message">${translate(this.error)}</div>

          ${this.open
            ? html`
                <div class="menu">
                  ${this.options.map(
                    (opt) => html`
                      <div
                        class="option ${opt.value === this.value ? 'selected' : ''}"
                        @click=${() => this._selectOption(opt)}
                      >
                        ${opt.label}
                      </div>
                    `
                  )}
                </div>
              `
            : null}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 16px;
      }

      label {
        font-size: 14px;
        color: var(--color-text-primary);
      }

      label.error {
        color: var(--color-error);
      }

      .dropdown {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .selected {
        padding: 7px 12px;
        border: 1px solid var(--color-text-secondary);
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .selected.error {
        border: 1px solid var(--color-error);
      }

      label.error {
        color: var(--color-error);
      }

      .selected.open {
        border: 2px solid var(--color-text-primary);
      }

      .arrow {
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .arrow.open {
        transform: rotate(180deg);
      }

      label {
        font-size: 14px;
        color: var(--color-text-primary);
      }

      .menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-top: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10;
        max-height: 200px;
        overflow-y: auto;
        animation: fadeIn 0.15s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .option {
        padding: 10px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }

      .option:hover {
        background: #f0f6ff;
      }

      .option.selected {
        background: #e5f0ff;
        font-weight: 500;
      }

      .error-message {
        font-size: 12px;
        color: var(--color-error);
      }
    `;
  }
}

window.customElements.define('ing-dropdown', Dropdown);
