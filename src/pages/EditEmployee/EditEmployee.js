import { LitElement, html } from 'lit';

export class EditEmployee extends LitElement {
  static get properties() {
    return {
      employeeId: { type: String },
    };
  }

  constructor() {
    super();
  }

  onBeforeEnter(location) {
    this.employeeId = location.params.employeeId;
  }

  render() {
    return html`<div>Employee List Component</div>`;
  }
}

window.customElements.define('edit-employee', EditEmployee);
