import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import './LanguageSelect';
import i18n from '@/i18n';
import { LanguageFlagMap } from '@/lib';

vi.mock('@/i18n', () => {
  return {
    default: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  };
});

vi.mock('@/lib', () => {
  return {
    LanguageFlagMap: {
      en: 'flag-en.png',
      tr: 'flag-tr.png',
    },
  };
});

describe('LanguageSelect', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<language-select></language-select>`;
    i18n.changeLanguage.mockReset();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders the default language flag', () => {
    const select = container.querySelector('language-select');
    const img = select.shadowRoot.querySelector('.select-trigger img');
    expect(img).toHaveAttribute('src', LanguageFlagMap['en']);
  });

  it('opens and closes dropdown on trigger click', async () => {
    const select = container.querySelector('language-select');
    const trigger = select.shadowRoot.querySelector('.select-trigger');

    expect(select.shadowRoot.querySelector('.dropdown')).toBeNull();
    fireEvent.click(trigger);
    expect(select.shadowRoot.querySelector('.dropdown')).toBeDefined();
    fireEvent.click(trigger);
    expect(select.shadowRoot.querySelector('.dropdown')).toBeNull();
  });

  it('selects a language and calls i18next.changeLanguage', async () => {
    await window.customElements.whenDefined('language-select');

    const select = container.querySelector('language-select');
    await select.updateComplete;

    const trigger = select.shadowRoot.querySelector('.select-trigger');

    fireEvent.click(trigger);
    await select.updateComplete;

    const trItem = Array.from(select.shadowRoot.querySelectorAll('.dropdown-item')).find((el) =>
      el.textContent.includes('TR')
    );
    expect(trItem).toBeTruthy();

    fireEvent.click(trItem);
    await select.updateComplete;

    expect(select.isOpen).toBe(false);
    expect(select.value).toBe('tr');
    expect(i18n.changeLanguage).toHaveBeenCalledWith('tr');
  });

  it('closes dropdown when clicking outside', () => {
    const select = container.querySelector('language-select');
    const trigger = select.shadowRoot.querySelector('.select-trigger');

    fireEvent.click(trigger);
    expect(select.isOpen).toBe(true);

    fireEvent.click(document.body);
    expect(select.isOpen).toBe(false);
  });
});
