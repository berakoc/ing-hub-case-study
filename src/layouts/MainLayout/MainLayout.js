import { LitElement, html } from 'lit';

export class MainLayout extends LitElement {
  render() {
    return html`
      <div class="main-container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('main-layout', MainLayout);
