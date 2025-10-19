import { formatDateToDefault, TABLE_ITEMS_PER_PAGE, translate } from '@/lib';
import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhPencilSimpleLine';
import '@phosphor-icons/webcomponents/PhTrashSimple';

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      currentPage: { type: Number },
    };
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

  render() {
    return html`<div class="table-container">
      <table>
        <thead>
          <tr>
            <th>${translate('employeeList.tableHeader.firstName')}</th>
            <th>${translate('employeeList.tableHeader.lastName')}</th>
            <th>${translate('employeeList.tableHeader.dateOfEmployment')}</th>
            <th>${translate('employeeList.tableHeader.dateOfBirth')}</th>
            <th>${translate('employeeList.tableHeader.phone')}</th>
            <th>${translate('employeeList.tableHeader.email')}</th>
            <th>${translate('employeeList.tableHeader.department')}</th>
            <th>${translate('employeeList.tableHeader.position')}</th>
            <th>${translate('employeeList.tableHeader.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees
            .slice(
              (this.currentPage - 1) * TABLE_ITEMS_PER_PAGE,
              this.currentPage * TABLE_ITEMS_PER_PAGE
            )
            .map(
              (employee) =>
                html`<tr>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${formatDateToDefault(employee.dateOfEmployment)}</td>
                  <td>${formatDateToDefault(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="edit-button">
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
