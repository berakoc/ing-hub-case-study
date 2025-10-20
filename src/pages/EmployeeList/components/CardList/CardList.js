import { ButtonVariant } from '@/components';
import {
  CARD_LIST_ITEMS_PER_PAGE,
  formatDateToDefault,
  getEmployeePosition,
  translate,
} from '@/lib';
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '@phosphor-icons/webcomponents/PhPencilSimpleLine';
import '@phosphor-icons/webcomponents/PhTrashSimple';

export class CardList extends LitElement {
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

  renderEmployeeInfoItem(label, value) {
    return html`<div class="info">
      <span class="info-label">${label}</span>
      <span class="info-value">${value}</span>
    </div>`;
  }

  render() {
    return html`
      <div class="container">
        ${repeat(
          this.employees.slice(
            (this.currentPage - 1) * CARD_LIST_ITEMS_PER_PAGE,
            this.currentPage * CARD_LIST_ITEMS_PER_PAGE
          ),
          (employee) => employee.id,
          (employee) =>
            html`<div class="card">
              <div class="card-row">
                ${this.renderEmployeeInfoItem(translate('employee.firstName'), employee.firstName)}
                ${this.renderEmployeeInfoItem(translate('employee.lastName'), employee.lastName)}
              </div>
              <div class="card-row">
                ${this.renderEmployeeInfoItem(
                  translate('employee.dateOfEmployment'),
                  formatDateToDefault(employee.dateOfEmployment)
                )}
                ${this.renderEmployeeInfoItem(
                  translate('employee.dateOfBirth'),
                  formatDateToDefault(employee.dateOfBirth)
                )}
              </div>
              <div class="card-row">
                ${this.renderEmployeeInfoItem(translate('employee.phone'), employee.phone)}
                ${this.renderEmployeeInfoItem(translate('employee.email'), employee.email)}
              </div>
              <div class="card-row">
                ${this.renderEmployeeInfoItem(
                  translate('employee.department'),
                  employee.department
                )}
                ${this.renderEmployeeInfoItem(
                  translate('employee.position'),
                  getEmployeePosition({ employee, translate })
                )}
              </div>
              <div class="action-buttons">
                <ing-button .variant=${ButtonVariant.Primary}>
                  <ph-pencil-simple-line></ph-pencil-simple-line>
                  ${translate('buttonAction.edit')}
                </ing-button>
                <ing-button
                  @click=${() => this._openDeleteEmployeeModal(employee)}
                  .variant=${ButtonVariant.Secondary}
                >
                  <ph-trash-simple weight="fill"></ph-trash-simple>
                  ${translate('buttonAction.delete')}</ing-button
                >
              </div>
            </div>`
        )}
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: grid;
        row-gap: 32px;
        grid-template-columns: repeat(2, max-content);
        justify-content: space-between;
        margin: 0 64px 48px;
      }

      .card {
        width: 480px;
        background-color: var(--color-white);
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .card-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 24px;
      }

      .info {
        display: flex;
        flex-direction: column;
        width: 50%;
      }

      .info-label {
        font-size: 14px;
        font-weight: 400;
        color: var(--color-text-secondary);
      }

      .info-value {
        font-size: 18px;
        font-weight: 400;
        color: var(--color-text-primary);
      }

      .action-buttons {
        display: flex;
        flex-direction: row;
        gap: 12px;
      }

      @media (max-width: 1200px) {
        .container {
          display: flex;
          flex-direction: row;
          overflow-x: scroll;
          margin: 0;
          gap: 12px;
          padding: 8px 8px 12px;
        }

        .card {
          width: auto;
          flex-direction: column;
          gap: 12px;
          padding: 18px;
        }

        .card-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .info {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .info-label {
          white-space: nowrap; /* prevent wrapping */
        }
      }
    `;
  }
}

window.customElements.define('ing-card-list', CardList);
