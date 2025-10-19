import { LitElement, html, css } from 'lit';
import '@phosphor-icons/webcomponents/PhUserList';
import '@phosphor-icons/webcomponents/PhPlus';
import { translate } from '@/lib';

export class MainLayout extends LitElement {
  render() {
    return html`
      <div class="main-container">
        <header class="main-header">
          <div class="logo-container">
            <img src="/ing-logo.png" alt="ING Logo" class="logo" />
            <h1 class="company-name">ING</h1>
          </div>
          <div class="header-actions">
            <a href="/employee-list" class="employee-list-action">
              <ph-user-list></ph-user-list>
              <span>${translate('mainLayout.header.employees')}</span>
            </a>
            <a href="/add-employee" class="add-new-action">
              <ph-plus></ph-plus>
              <span>${translate('mainLayout.header.addNew')}</span>
            </a>
            <language-select></language-select>
          </div>
        </header>
        <main class="main-content">
          <slot></slot>
        </main>
      </div>
    `;
  }

  static get styles() {
    return css`
      .main-container {
        min-height: 100vh;
        background-color: var(--color-background);
      }
      .main-header {
        background-color: var(--color-white);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .logo-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .logo {
        height: 18px;
      }

      .company-name {
        font-size: 12px;
        color: var(--color-text-primary);
        font-weight: 600;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .employee-list-action,
      .add-new-action {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--color-ing-orange);
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }

      .main-content {
        padding: 32px;
      }
    `;
  }
}

customElements.define('main-layout', MainLayout);
