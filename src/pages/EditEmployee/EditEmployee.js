import { getEmployeeFullname, Path, store, translate } from '@/lib';
import { TanStackFormController } from '@tanstack/lit-form';
import { LitElement, html, css, nothing } from 'lit';
import z from 'zod';
import { employeePositions } from '@/lib/store/data';
import { Router } from '@vaadin/router';
import { when } from 'lit/directives/when.js';
import './components';

const phonePattern = /^\+\(\d{1,3}\) \d{3} \d{3} \d{2} \d{2}$/;
const employeeSchema = z.object({
  firstName: z.string().min(2, { error: 'employee.errors.firstNameMinError' }),
  lastName: z.string().min(2, { error: 'employee.errors.lastNameMinError' }),
  dateOfEmployment: z.string().nonempty({ error: 'employee.errors.emptyDateOfEmployment' }),
  dateOfBirth: z.string().nonempty({ error: 'employee.errors.dateOfBirth' }),
  phone: z.string().regex(phonePattern, { error: 'employee.errors.phone' }),
  email: z.email({ message: 'employee.errors.email' }),
  department: z.string().min(2, { error: 'employee.errors.departmentMinError' }),
  position: z.string().min(2, { error: 'employee.errors.positionNotSelectedError' }),
});
export class EditEmployee extends LitElement {
  #form;

  static get properties() {
    return {
      employee: { type: Object },
      isEditEmployeeModalOpen: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.isEditEmployeeModalOpen = false;
  }

  onBeforeEnter(location) {
    const employeeId = location.params.employeeId;
    this.employee = store.getState().employees.find((employee) => employee.id === employeeId);

    const initialDefaultValues = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: '',
    };

    this.#form = new TanStackFormController(this, {
      defaultValues: {
        ...initialDefaultValues,
        ...this.employee,
      },
      onSubmit({ value: formValues }) {
        store.getState().updateEmployee(formValues);
        Router.go(Path.EmployeeList);
      },
      validators: {
        onChange: employeeSchema,
      },
    });
  }

  _handleCancel() {
    Router.go(Path.EmployeeList);
  }

  _handleSubmit() {
    this.isEditEmployeeModalOpen = true;
  }

  _closeEditEmployeeModal() {
    this.isEditEmployeeModalOpen = false;
  }

  _editEmployee() {
    this.#form.api.handleSubmit();
  }

  render() {
    const positionOptions = employeePositions.map((position) => ({
      label: translate(position.labelKey),
      value: position.value,
    }));
    const employeeFullname = this.employee ? getEmployeeFullname(this.employee) : '';
    return html`<div class="container">
      <h2 class="title">${translate('editEmployee.title')}</h2>
      <form id="add-employee-form" class="form">
        <div class="form-inputs">
          ${this.#form.field(
            {
              name: 'firstName',
            },
            (field) => {
              return html`<ing-text-input
                id="firstName"
                label=${translate('employee.firstName')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-text-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'lastName',
            },
            (field) => {
              return html`<ing-text-input
                id="lastName"
                label=${translate('employee.lastName')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-text-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'dateOfEmployment',
            },
            (field) => {
              return html`<ing-date-input
                id="dateOfEmployment"
                label=${translate('employee.dateOfEmployment')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail?.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-date-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'dateOfBirth',
            },
            (field) => {
              return html`<ing-date-input
                id="dateOfBirth"
                label=${translate('employee.dateOfBirth')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail?.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-date-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'phone',
            },
            (field) => {
              return html`<ing-phone-input
                id="phone"
                label=${translate('employee.phone')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-phone-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'email',
            },
            (field) => {
              return html`<ing-text-input
                id="email"
                label=${translate('employee.email')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                type="email"
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-text-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'department',
            },
            (field) => {
              return html`<ing-text-input
                id="department"
                label=${translate('employee.department')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                type="department"
                @blur=${() => field.handleBlur()}
                @input=${(customEvent) => {
                  if (customEvent.detail.event) {
                    const newValue = customEvent.detail.event.target.value;
                    field.handleChange(newValue);
                  }
                }}
              ></ing-text-input>`;
            }
          )}
          ${this.#form.field(
            {
              name: 'position',
            },
            (field) => {
              return html`<ing-dropdown
                id="position"
                .options=${positionOptions}
                label=${translate('employee.position')}
                .error=${!field.state.meta.isValid ? field.state.meta.errors[0].message : null}
                .value=${field.state.value}
                type="position"
                @blur=${() => field.handleBlur()}
                @value-change=${(customEvent) => {
                  field.handleChange(customEvent.detail.value);
                }}
              ></ing-dropdown>`;
            }
          )}
        </div>
        <div class="action-buttons">
          <ing-button @click=${this._handleSubmit} type="submit"
            >${translate('buttonAction.save')}</ing-button
          >
          <ing-button @click=${() => this._handleCancel()} variant="tertiary" type="button"
            >${translate('buttonAction.cancel')}</ing-button
          >
        </div>
      </form>
      ${when(
        this.isEditEmployeeModalOpen,
        () =>
          html`<edit-employee-modal
            ?isOpen=${this.isEditEmployeeModalOpen}
            @close-modal=${this._closeEditEmployeeModal}
            @edit-employee=${this._editEmployee}
            .employeeFullname=${employeeFullname}
          ></edit-employee-modal>`,
        () => nothing
      )}
    </div>`;
  }

  static get styles() {
    return css`
      ing-button {
        --button-width: 240px;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 32px;
        position: relative;
      }

      .title {
        font-size: 24px;
        color: var(--color-ing-orange);
        margin: 0;
        font-weight: 500;
      }

      .form {
        background-color: var(--color-white);
        display: flex;
        flex-direction: column;
        gap: 64px;
      }

      .form-inputs {
        display: grid;
        gap: 1rem;
      }

      .form-inputs input {
        padding: 0.6rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
        width: 100%;
      }

      @media (max-width: 639px) {
        ing-button {
          --button-width: 100%;
        }

        .form-inputs {
          grid-template-columns: 1fr;
        }

        .form {
          padding: 16px;
          gap: 32px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }
      }

      @media (min-width: 640px) and (max-width: 1023px) {
        .form-inputs {
          grid-template-columns: repeat(2, 1fr);
        }

        .action-buttons {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 16px;
        }

        .form {
          padding: 32px;
        }
      }

      @media (min-width: 1024px) {
        .form-inputs {
          grid-template-columns: repeat(3, 1fr);
          gap: 64px;
        }

        .action-buttons {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 64px;
        }

        .form {
          padding: 64px 96px;
        }
      }
    `;
  }
}

window.customElements.define('edit-employee', EditEmployee);
