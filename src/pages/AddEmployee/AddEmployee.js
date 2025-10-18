import { LitElement, html } from 'lit';

export class AddEmployee extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`<div>Employee List Component</div>`;
  }
}

window.customElements.define('add-employee', AddEmployee);
