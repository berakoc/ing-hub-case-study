import i18next from 'i18next';
import { LitElement, html } from 'lit';

export class EmployeeList extends LitElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`<div>${i18next.t('title')}</div>`;
  }
}

window.customElements.define('employee-list', EmployeeList);
