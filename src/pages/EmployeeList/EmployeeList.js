import { translate } from '@/lib';
import { LitElement, html } from 'lit';

export class EmployeeList extends LitElement {
  constructor() {
    super();
    console.log('EmployeeList component initialized', translate('title'));
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`<div>${translate('title')}</div>`;
  }
}

window.customElements.define('employee-list', EmployeeList);
