import { LitElement, html, css, nothing } from 'lit';
import '@phosphor-icons/webcomponents/PhCheck';

export class Checkbox extends LitElement {
  static get properties() {
    return {
      checked: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.checked = false;
  }

  _handleCheckboxClick() {
    this.checked = !this.checked;
  }

  render() {
    return html`<button
      @click=${this._handleCheckboxClick}
      class=${`container ${this.checked && 'checked'}`}
    >
      ${this.checked
        ? html`<span class="icon">
            <ph-check weight="bold" size="10"></ph-check>
          </span>`
        : nothing}
    </button>`;
  }

  static get styles() {
    return css`
      .container {
        background-color: var(--color-white);
        border: 1px solid var(--color-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        cursor: pointer;
      }

      .container.checked {
        background-color: var(--color-ing-orange);
        border: 1px solid var(--color-ing-orange);
      }

      .container:active {
        transform: scale(0.95);
      }

      .icon {
        color: var(--color-white);
      }
    `;
  }
}

window.customElements.define('ing-checkbox', Checkbox);
