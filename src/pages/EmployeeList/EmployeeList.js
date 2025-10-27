import {
  CARD_LIST_ITEMS_PER_PAGE,
  getEmployeeFullname,
  getEmployeeSearchResults,
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
import debounce from 'lodash.debounce';
import './components';

export class EmployeeList extends LitElement {
  static get properties() {
    return {
      viewMode: { type: String },
      currentPage: { type: Number },
      isDeleteEmployeeModalOpen: { type: Boolean },
      selectedEmployee: { type: Object },
      searchTerm: { type: String },
      filteredEmployees: { type: Array },
    };
  }

  constructor() {
    super();
    this.employees = store.getState().employees;
    this.viewMode = ViewMode.Table;
    this.currentPage = 1;
    this.isDeleteEmployeeModalOpen = false;
    this.selectedEmployeeId = null;
    this.searchTerm = '';
    this.selectedEmployeeIds = [];
    this.filteredEmployees = null;
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

    this.employees = store.getState().employees;

    if (this.searchTerm) {
      this.filteredEmployees = getEmployeeSearchResults(this.employees, this.searchTerm);
    } else {
      this.filteredEmployees = null;
    }

    this.requestUpdate();
  }

  _handleSearch = debounce(() => {
    this.currentPage = 1;
    this.filteredEmployees = getEmployeeSearchResults(this.employees, this.searchTerm);
    this.requestUpdate();
  }, 300);

  _handleSearchInput(event) {
    this.searchTerm = event.target.value.toLowerCase().trim();
    this._handleSearch();
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });
  }

  _openDeleteEmployeeModalForSelectedEmployees(event) {
    this.isDeleteEmployeeModalOpen = true;
    this.selectedEmployeeIds = event.detail.selectedEmployeeIds;
  }

  _deleteSelectedEmployees() {
    this.isDeleteEmployeeModalOpen = false;
    store.getState().deleteSelectedEmployees(this.selectedEmployeeIds);
    this.selectedEmployeeIds = [];

    this.employees = store.getState().employees;

    if (this.searchTerm) {
      this.filteredEmployees = getEmployeeSearchResults(this.employees, this.searchTerm);
    } else {
      this.filteredEmployees = null;
    }

    this.requestUpdate();
  }

  _onChangePage(event) {
    this.currentPage = event.detail.currentPage;
  }

  render() {
    const totalPages = computeTotalPages(
      this.filteredEmployees === null ? this.employees.length : this.filteredEmployees?.length,
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
      <div class="data-view-container">
        <ing-text-input
          .value=${this.searchTerm}
          @input=${this._handleSearchInput}
          label="${translate('searchForEmployee')}"
        ></ing-text-input>
        <div class="data-view">
          ${choose(
            this.viewMode,
            [
              [
                ViewMode.Table,
                () =>
                  html`<ing-employee-table
                    .employees=${this.searchTerm ? (this.filteredEmployees ?? []) : this.employees}
                    .currentPage=${this.currentPage}
                    .selectedEmployeesIds=${this.selectedEmployeeIds}
                    @open-delete-employee-modal=${this._openDeleteEmployeeModal}
                    @change-page=${this._onChangePage}
                    @open-delete-employee-modal-for-selected-employees=${this
                      ._openDeleteEmployeeModalForSelectedEmployees}
                  ></ing-employee-table>`,
              ],
              [
                ViewMode.CardList,
                () =>
                  html`<ing-card-list
                    .employees=${this.filteredEmployees || this.employees}
                    .currentPage=${this.currentPage}
                    @open-delete-employee-modal=${this._openDeleteEmployeeModal}
                    @change-page=${this._onChangePage}
                  ></ing-card-list>`,
              ],
            ],
            () => {
              throw new Error(`Unknown view mode: ${this.viewMode}`);
            }
          )}
          ${when(
            totalPages > 1 &&
              ((this.filteredEmployees && this.filteredEmployees.length > 0) ||
                (!this.filteredEmployees && this.employees.length > 0)),
            () => html`
              <div class="pagination-container">
                <ing-pagination
                  .currentPage=${this.currentPage}
                  .totalPages=${totalPages}
                  @page-changed=${this._onChangePage}
                ></ing-pagination>
              </div>
            `
          )}
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
            .selectedEmployeeIds=${this.selectedEmployeeIds}
            @delete-selected-employees=${this._deleteSelectedEmployees}
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

      .data-view-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
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
