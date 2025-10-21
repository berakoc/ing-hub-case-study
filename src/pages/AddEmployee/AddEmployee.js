import { Path, store, translate } from '@/lib';
import { TanStackFormController } from '@tanstack/lit-form';
import { LitElement, html, css } from 'lit';
import z from 'zod';
import { employeePositions } from '@/lib/store/data';
import { Router } from '@vaadin/router';
import { nanoid } from 'nanoid';

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
export class AddEmployee extends LitElement {
  constructor() {
    super();
  }

  #form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: '',
    },
    onSubmit({ value: formValues }) {
      store.getState().addEmployee({ ...formValues, id: nanoid() });
      Router.go(Path.EmployeeList);
    },
    validators: {
      onChange: employeeSchema,
    },
  });

  _handleCancel() {
    Router.go(Path.EmployeeList);
  }

  _handleSubmit() {
    this.#form.api.handleSubmit();
  }

  render() {
    const positionOptions = employeePositions.map((position) => ({
      label: translate(position.labelKey),
      value: position.value,
    }));
    return html`<div class="container">
      <h2 class="title">${translate('addEmployee.title')}</h2>
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

window.customElements.define('add-employee', AddEmployee);
