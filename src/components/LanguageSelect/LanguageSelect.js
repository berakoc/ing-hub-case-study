import { LanguageFlagMap } from '@/lib';
import i18next from 'i18next';
import { LitElement, html, css } from 'lit';

export class LanguageSelect extends LitElement {
  static properties = {
    value: { type: String },
    isOpen: { type: Boolean },
    mode: { type: String },
  };

  constructor() {
    super();
    this.value = i18next.language || 'en';
    this.isOpen = false;
    this.mode = 'default';
  }

  _onChange(e, lang) {
    e.stopPropagation();
    this.value = lang;
    this.isOpen = false;
    i18next.changeLanguage(lang);
  }

  _toggleDropdown(e) {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  render() {
    return html`
      <div class="select-container">
        <div class="select-trigger" @click=${this._toggleDropdown}>
          <img src=${LanguageFlagMap[this.value]} alt="${this.value}" class="flag-option" />
        </div>
        ${this.isOpen
          ? html`
              <div class="dropdown" @click=${(e) => e.stopPropagation()}>
                ${Object.entries(LanguageFlagMap).map(
                  ([lang, src]) => html`
                    <div
                      class="dropdown-item ${this.value === lang ? 'selected' : ''}"
                      @click=${(e) => this._onChange(e, lang)}
                    >
                      <img src=${src} alt="${lang}" class="flag-option" />
                      <span>${lang.toUpperCase()}</span>
                    </div>
                  `
                )}
              </div>
            `
          : null}
      </div>
    `;
  }

  static styles = css`
    .select-container {
      position: relative;
      display: inline-block;
    }

    .select-trigger {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      background: white;
    }

    .flag-option {
      width: 20px;
      height: 14px;
    }

    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      gap: 8px;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .dropdown-item.selected {
      background: #eee;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._handleClickOutside = (e) => {
      if (!this.renderRoot.contains(e.composedPath()[0])) {
        this.isOpen = false;
      }
    };
    document.addEventListener('click', this._handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleClickOutside);
  }
}

customElements.define('language-select', LanguageSelect);
