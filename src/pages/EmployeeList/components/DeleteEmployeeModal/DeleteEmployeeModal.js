import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhX';
import { translate } from '@/lib';
import { ButtonVariant } from '@/components';
import { when } from 'lit/directives/when.js';

export class DeleteEmployeeModal extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean },
      employeeFullname: { type: String },
    };
  }

  constructor() {
    super();
    this.isOpen = false;
    this.selectedEmployeeIds = [];
  }

  _deleteEmployee() {
    this.dispatchEvent(new CustomEvent('delete-employee', { bubbles: true, composed: true }));
  }

  _closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal', { bubbles: true, composed: true }));
  }

  _deleteSelectedEmployees() {
    this.dispatchEvent(
      new CustomEvent('delete-selected-employees', { bubbles: true, composed: true })
    );
  }

  render() {
    return html`
      <ing-modal ?isOpen=${this.isOpen}>
        <div class="container">
          ${when(
            this.selectedEmployeeIds.length > 0,
            () =>
              html`<div class="header">
                  <h1 class="title">
                    ${translate('employeeList.deleteEmployeeModal.deleteSelectedEmployees.title')}
                  </h1>
                  <button @click=${this._closeModal} class="close-button">
                    <ph-x weight="bold"></ph-x>
                  </button>
                </div>
                <span class="subtitle"
                  >${translate(
                    'employeeList.deleteEmployeeModal.deleteSelectedEmployees.subtitle',
                    {
                      count: this.selectedEmployeeIds.length,
                    }
                  )}</span
                >
                <div class="action-buttons">
                  <ing-button
                    @click=${this._deleteSelectedEmployees}
                    .variant=${ButtonVariant.Primary}
                    >${translate('buttonAction.proceed')}</ing-button
                  >
                  <ing-button @click=${this._closeModal} .variant=${ButtonVariant.Tertiary}
                    >${translate('buttonAction.cancel')}</ing-button
                  >
                </div>`,
            () =>
              html`<div class="header">
                  <h1 class="title">${translate('employeeList.deleteEmployeeModal.title')}</h1>
                  <button @click=${this._closeModal} class="close-button">
                    <ph-x weight="bold"></ph-x>
                  </button>
                </div>
                <span class="subtitle"
                  >${translate('employeeList.deleteEmployeeModal.subtitle', {
                    employeeFullname: this.employeeFullname,
                  })}</span
                >
                <div class="action-buttons">
                  <ing-button @click=${this._deleteEmployee} .variant=${ButtonVariant.Primary}
                    >${translate('buttonAction.proceed')}</ing-button
                  >
                  <ing-button @click=${this._closeModal} .variant=${ButtonVariant.Tertiary}
                    >${translate('buttonAction.cancel')}</ing-button
                  >
                </div>`
          )}
        </div>
      </ing-modal>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .title {
        font-size: 24px;
        color: var(--color-ing-orange);
        font-weight: 600;
        margin: 0;
      }

      .close-button {
        border: none;
        background-color: var(--color-white);
        display: flex;
        align-items: center;
        font-size: 24px;
        color: var(--color-ing-orange);
        outline: none;
        padding: 0;
        cursor: pointer;
      }

      .subtitle {
        font-size: 16px;
        font-weight: 400;
        color: var(--color-text-primary);
        max-width: 640px;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `;
  }
}

customElements.define('delete-employee-modal', DeleteEmployeeModal);
