import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhCaretLeft';
import '@phosphor-icons/webcomponents/PhCaretRight';

export class Pagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    maxPagesVisible: { type: Number },
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 10;
    this.maxVisible = 5;
  }

  _goToPage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.dispatchEvent(
      new CustomEvent('page-changed', {
        detail: { currentPage: this.currentPage },
        bubbles: true,
        composed: true,
      })
    );
  }

  _getPageNumbers() {
    const pages = [];
    const { currentPage, totalPages, maxVisible } = this;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  render() {
    const pageNumbers = this._getPageNumbers();

    return html`
      <div class="pagination">
        <button
          @click=${() => this._goToPage(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
          class="prev-button"
        >
          <ph-caret-left weight="bold"></ph-caret-left>
        </button>

        ${pageNumbers[0] > 1
          ? html`<button class="page-button" @click=${() => this._goToPage(1)}>1</button>
              ${pageNumbers[0] > 2 ? html`<span>...</span>` : ''}`
          : ''}
        ${pageNumbers.map(
          (p) => html`
            <button
              class="page-button ${p === this.currentPage ? 'page-button-active' : ''}"
              @click=${() => this._goToPage(p)}
            >
              ${p}
            </button>
          `
        )}
        ${pageNumbers[pageNumbers.length - 1] < this.totalPages
          ? html`${pageNumbers[pageNumbers.length - 1] < this.totalPages - 1
                ? html`<span>...</span>`
                : ''}
              <button class="page-button" @click=${() => this._goToPage(this.totalPages)}>
                ${this.totalPages}
              </button>`
          : ''}
        <button
          @click=${() => this._goToPage(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
          class="next-button"
        >
          <ph-caret-right weight="bold"></ph-caret-right>
        </button>
      </div>
    `;
  }

  static styles = css`
    .pagination {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .page-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      border: none;
      background-color: var(--color-background);
      color: var(--color-text-primary);
    }

    .page-button-active {
      background-color: var(--color-ing-orange);
      color: white;
      font-weight: bold;
    }

    .next-button,
    .prev-button {
      font-size: 20px;
      background-color: var(--color-background);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-ing-orange);
      cursor: pointer;
    }

    .next-button:disabled,
    .prev-button:disabled {
      cursor: not-allowed;
      color: var(--color-text-secondary);
    }
  `;
}

customElements.define('ing-pagination', Pagination);
