import {
  CARD_LIST_ITEMS_PER_PAGE,
  getEmployeeFullname,
  store,
  TABLE_ITEMS_PER_PAGE,
  translate,
} from '@/lib';
import { LitElement, html, css, nothing } from 'lit';
import '@phosphor-icons/webcomponents/PhList';
import '@phosphor-icons/webcomponents/PhSquaresFour';
import { computeTotalPages, ViewMode } from './common';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import './components';

export class EmployeeList extends LitElement {
  static get properties() {
    return {
      viewMode: { type: String },
      currentPage: { type: Number },
      isDeleteEmployeeModalOpen: { type: Boolean },
      selectedEmployee: { type: Object },
    };
  }

  constructor() {
    super();
    this.employees = store.getState().employees;
    this.viewMode = ViewMode.Table;
    this.currentPage = 1;
    this.isDeleteEmployeeModalOpen = false;
    this.selectedEmployeeId = null;
  }

  _openDeleteEmployeeModal(event) {
    this.isDeleteEmployeeModalOpen = true;
    this.selectedEmployee = event.detail.selectedEmployee;
  }

  _closeDeleteEmployeeModal() {
    this.isDeleteEmployeeModalOpen = false;
  }

  _deleteEmployee() {
    this.isDeleteEmployeeModalOpen = false;
    store.getState().deleteEmployee(this.selectedEmployee.id);
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });
  }

  render() {
    const totalPages = computeTotalPages(
      this.employees.length,
      this.viewMode === ViewMode.Table ? TABLE_ITEMS_PER_PAGE : CARD_LIST_ITEMS_PER_PAGE
    );
    const employeeFullname = this.selectedEmployee
      ? getEmployeeFullname(this.selectedEmployee)
      : '';
    return html`<div class="container">
      <div class="header">
        <h2 class="title">${translate('employeeList.title')}</h2>
        <div class="view-options">
          <ph-list
            @click=${() => (this.viewMode = ViewMode.Table)}
            class="${`view-option ${this.viewMode === ViewMode.Table && 'view-option-selected'}`}"
          ></ph-list>
          <ph-squares-four
            @click=${() => (this.viewMode = ViewMode.CardList)}
            class="${`view-option ${this.viewMode === ViewMode.CardList && 'view-option-selected'}`}"
          ></ph-squares-four>
        </div>
      </div>
      <div class="data-view">
        ${choose(
          this.viewMode,
          [
            [
              ViewMode.Table,
              () =>
                html`<ing-employee-table
                  .employees=${this.employees}
                  .currentPage=${this.currentPage}
                  @open-delete-employee-modal=${this._openDeleteEmployeeModal}
                ></ing-employee-table>`,
            ],
            [
              ViewMode.CardList,
              () =>
                html`<ing-card-list
                  .employees=${this.employees}
                  .currentPage=${this.currentPage}
                  @open-delete-employee-modal=${this._openDeleteEmployeeModal}
                ></ing-card-list>`,
            ],
          ],
          () => {
            throw new Error(`Unknown view mode: ${this.viewMode}`);
          }
        )}
        <div class="pagination-container">
          <ing-pagination
            .currentPage=${this.currentPage}
            @page-changed=${(e) => (this.currentPage = e.detail.currentPage)}
            .totalPages=${totalPages}
          ></ing-pagination>
        </div>
      </div>
      ${when(
        this.isDeleteEmployeeModalOpen,
        () =>
          html`<delete-employee-modal
            ?isOpen=${this.isDeleteEmployeeModalOpen}
            @close-modal=${this._closeDeleteEmployeeModal}
            @delete-employee=${this._deleteEmployee}
            .employeeFullname=${employeeFullname}
          ></delete-employee-modal>`,
        () => nothing
      )}
    </div>`;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        position: relative;
        gap: 32px;
      }
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .data-view {
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 20px;
      }

      .title {
        font-size: 24px;
        color: var(--color-ing-orange);
        margin: 0;
        font-weight: 500;
      }

      .view-options {
        display: flex;
        gap: 12px;
      }

      .view-option {
        cursor: pointer;
        font-size: 32px;
        color: var(--color-ing-orange-light);
        z-index: 0;
      }

      .view-option-selected {
        color: var(--color-ing-orange);
      }

      .pagination-container {
        align-self: center;
      }
    `;
  }
}

window.customElements.define('employee-list', EmployeeList);
