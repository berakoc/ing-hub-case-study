import {
  formatDateToDefault,
  getEmployeePosition,
  Path,
  TABLE_ITEMS_PER_PAGE,
  translate,
} from '@/lib';
import { when } from 'lit/directives/when.js';
import { LitElement, html, css, nothing } from 'lit';
import '@phosphor-icons/webcomponents/PhPencilSimpleLine';
import '@phosphor-icons/webcomponents/PhTrashSimple';
import { Router } from '@vaadin/router';

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      currentPage: { type: Number },
      selectedEmployeesIds: { type: Array },
      areAllEmployeesSelected: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.selectedEmployeesIds = [];
    this.areAllEmployeesSelected = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('currentPage')) {
      this.areAllEmployeesSelected = false;
      this.selectedEmployeesIds = [];
    }

    if (changedProperties.has('employees') || changedProperties.has('currentPage')) {
      const totalPages = Math.ceil((this.employees?.length ?? 0) / TABLE_ITEMS_PER_PAGE) || 1;
      if (this.currentPage > totalPages) {
        this.dispatchEvent(
          new CustomEvent('change-page', {
            bubbles: true,
            composed: true,
            detail: { currentPage: Math.max(1, totalPages) },
          })
        );
      }
    }

    const currentPageEmployeeIds = this.employees
      .slice((this.currentPage - 1) * TABLE_ITEMS_PER_PAGE, this.currentPage * TABLE_ITEMS_PER_PAGE)
      .map((e) => e.id);

    this.areAllEmployeesSelected =
      currentPageEmployeeIds.length > 0 &&
      currentPageEmployeeIds.every((id) => this.selectedEmployeesIds.includes(id));
  }

  _openDeleteEmployeeModalForSelectedEmployees() {
    this.dispatchEvent(
      new CustomEvent('open-delete-employee-modal-for-selected-employees', {
        bubbles: true,
        composed: true,
        detail: {
          selectedEmployeeIds: this.selectedEmployeesIds,
        },
      })
    );
  }

  _openDeleteEmployeeModal(selectedEmployee) {
    this.dispatchEvent(
      new CustomEvent('open-delete-employee-modal', {
        bubbles: true,
        composed: true,
        detail: { selectedEmployee },
      })
    );
  }

  _onEdit(selectedEmployee) {
    Router.go(Path.EditEmployee.replace(':employeeId', selectedEmployee.id));
  }

  _handleCheckboxChange(event, employeeId) {
    if (event.detail.checked) {
      this.selectedEmployeesIds = [...this.selectedEmployeesIds, employeeId];
    } else {
      this.selectedEmployeesIds = this.selectedEmployeesIds.filter((id) => id !== employeeId);
    }
  }

  _handleSelectAllCheckboxChange(event) {
    this.areAllEmployeesSelected = event.detail.checked;
    if (event.detail.checked) {
      const currentPageEmployeeIds = this.employees
        .slice(
          (this.currentPage - 1) * TABLE_ITEMS_PER_PAGE,
          this.currentPage * TABLE_ITEMS_PER_PAGE
        )
        .map((employee) => employee.id);
      this.selectedEmployeesIds = Array.from(
        new Set([...this.selectedEmployeesIds, ...currentPageEmployeeIds])
      );
    } else {
      const currentPageEmployeeIds = this.employees
        .slice(
          (this.currentPage - 1) * TABLE_ITEMS_PER_PAGE,
          this.currentPage * TABLE_ITEMS_PER_PAGE
        )
        .map((employee) => employee.id);
      this.selectedEmployeesIds = this.selectedEmployeesIds.filter(
        (id) => !currentPageEmployeeIds.includes(id)
      );
    }
  }

  render() {
    const currentTableData = this.employees.slice(
      (this.currentPage - 1) * TABLE_ITEMS_PER_PAGE,
      this.currentPage * TABLE_ITEMS_PER_PAGE
    );
    const isTableEmpty = currentTableData.length === 0;
    if (isTableEmpty) {
      if (this.currentPage > 1) {
        this.dispatchEvent(
          new CustomEvent('change-page', {
            bubbles: true,
            composed: true,
            detail: { currentPage: this.currentPage - 1 },
          })
        );
      } else {
        return html`<div class="empty-table-container">
          <p>${translate('employeeList.noEmployeesFound')}</p>
        </div>`;
      }
    }

    return html` ${when(
        this.selectedEmployeesIds.length > 0,
        () =>
          html` <div class="table-actions">
            <ing-button @click=${this._openDeleteEmployeeModalForSelectedEmployees}
              >${translate('buttonAction.deleteSelected', {
                count: this.selectedEmployeesIds.length,
              })}</ing-button
            >
          </div>`,
        () => nothing
      )}
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <ing-checkbox
                  .checked=${this.areAllEmployeesSelected}
                  @checkbox-change=${this._handleSelectAllCheckboxChange}
                ></ing-checkbox>
              </th>
              <th>${translate('employee.firstName')}</th>
              <th>${translate('employee.lastName')}</th>
              <th>${translate('employee.dateOfEmployment')}</th>
              <th>${translate('employee.dateOfBirth')}</th>
              <th>${translate('employee.phone')}</th>
              <th>${translate('employee.email')}</th>
              <th>${translate('employee.department')}</th>
              <th>${translate('employee.position')}</th>
              <th>${translate('employee.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${currentTableData.map(
              (employee) =>
                html`<tr>
                  <td>
                    <ing-checkbox
                      .checked=${this.selectedEmployeesIds.find(
                        (selectedEmployeeId) => selectedEmployeeId === employee.id
                      ) !== undefined}
                      @checkbox-change=${(event) => this._handleCheckboxChange(event, employee.id)}
                    ></ing-checkbox>
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${formatDateToDefault(employee.dateOfEmployment)}</td>
                  <td>${formatDateToDefault(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${getEmployeePosition({ employee, translate })}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click=${() => this._onEdit(employee)} class="edit-button">
                        <ph-pencil-simple-line></ph-pencil-simple-line>
                      </button>
                      <button
                        class="delete-button"
                        @click=${() => this._openDeleteEmployeeModal(employee)}
                      >
                        <ph-trash-simple weight="fill"></ph-trash-simple>
                      </button>
                    </div>
                  </td>
                </tr>`
            )}
          </tbody>
        </table>
      </div>`;
  }

  static get styles() {
    return css`
      .table-container {
        white-space: nowrap;
        overflow-x: auto;
        background-color: var(--color-white);
        position: relative;
      }

      .empty-table-container {
        padding: 16px;
        font-size: 14px;
        color: var(--color-text-primary);
        background-color: var(--color-white);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }

      .table-actions {
        display: flex;
        justify-content: flex-end;
        padding: 16px 0;
        position: sticky;
        right: 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      tr {
        text-align: center;
        border-bottom: 1px solid var(--color-border);
      }

      th {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-ing-orange);
        padding: 16px;
      }

      td {
        font-size: 14px;
        font-weight: 400;
        padding: 16px;
      }

      .action-buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: center;
      }

      .edit-button,
      .delete-button {
        background: none;
        border: none;
        display: flex;
        cursor: pointer;
        padding: 8px;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: var(--color-ing-orange);
      }
    `;
  }
}

window.customElements.define('ing-employee-table', EmployeeTable);
