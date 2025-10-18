import { LitElement, html, css } from 'lit';

export class NotFound extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: var(--color-background);
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    }

    .container {
      text-align: center;
      padding: 2rem;
    }

    .message {
      font-size: 1.5rem;
      color: var(--color-text-primary);
      margin: 1rem 0 2rem;
    }

    .home-link {
      display: inline-block;
      padding: 1rem 2rem;
      background-color: var(--color-ing-orange);
      color: var(--color-white);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .home-link:hover {
      background-color: var(--color-ing-orange-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 97, 1, 0.2);
    }

    .home-link:active {
      background-color: var(--color-ing-orange-active);
      transform: translateY(0);
    }

    .illustration {
      width: 300px;
      opacity: 0.9;
    }
  `;

  render() {
    return html`
      <div class="container">
        <img class="illustration" src="/404-illustration.svg" alt="Page not found illustration" />
        <p class="message">Oops! The page you're looking for doesn't exist.</p>
        <a href="/employee-list" class="home-link"> Return to Employee List </a>
      </div>
    `;
  }
}

window.customElements.define('not-found', NotFound);
