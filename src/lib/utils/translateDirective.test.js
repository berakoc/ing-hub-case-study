import { describe, it, expect, vi, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { translate, TranslateDirective } from './translationDirective';
import i18n from '@/i18n';

vi.mock('@/i18n', () => {
  const listeners = [];

  return {
    default: {
      t: vi.fn((key, options) => {
        if (options?.name) return `Hello, ${options.name}`;
        if (key === 'welcome') return 'Welcome';
        return key;
      }),
      on: vi.fn((event, cb) => {
        listeners.push(cb);
      }),
      off: vi.fn((event, cb) => {
        const index = listeners.indexOf(cb);
        if (index > -1) listeners.splice(index, 1);
      }),
      changeLanguage: vi.fn((lang) => {
        listeners.forEach((cb) => cb(lang));
      }),
    },
  };
});

describe('translate directive', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders translation for a key', () => {
    render(html`<p>${translate('welcome')}</p>`, container);
    expect(container.querySelector('p').textContent).toBe('Welcome');
    expect(i18n.t).toHaveBeenCalledWith('welcome', undefined);
  });

  it('renders translation with options', () => {
    render(html`<p>${translate('hello', { name: 'Bera' })}</p>`, container);
    expect(container.querySelector('p').textContent).toBe('Hello, Bera');
    expect(i18n.t).toHaveBeenCalledWith('hello', { name: 'Bera' });
  });

  it('updates translation when language changes', () => {
    const container = document.createElement('div');
    render(html`<p>${translate('welcome')}</p>`, container);
    expect(container.querySelector('p').textContent).toBe('Welcome');
    i18n.changeLanguage('tr');
    expect(i18n.t).toHaveBeenCalledWith('welcome', undefined);
  });

  it('calls i18next.off with the listener', () => {
    const directiveInstance = new TranslateDirective({});
    const fakeListener = vi.fn();
    directiveInstance._listener = fakeListener;
    directiveInstance.disconnected();
    expect(i18n.off).toHaveBeenCalledWith('languageChanged', fakeListener);
  });
});
