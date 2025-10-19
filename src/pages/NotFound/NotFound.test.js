import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import './NotFound';
import { translate as originalTranslate } from '@/lib';

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
  };
});

describe('NotFound component', () => {
  let container;
  let notFound;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<not-found></not-found>`;
    notFound = container.querySelector('not-found');
    await notFound.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders illustration image', () => {
    const img = notFound.shadowRoot.querySelector('.illustration');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/404-illustration.svg');
    expect(img.getAttribute('alt')).toBe('Page not found illustration');
  });

  it('renders the message text using translate', () => {
    const message = notFound.shadowRoot.querySelector('.message');
    expect(message).toBeTruthy();
    expect(message.textContent).toBe('notFound.pageDoesNotExist');
    expect(originalTranslate).toHaveBeenCalledWith('notFound.pageDoesNotExist');
  });

  it('renders home link with correct text and href', () => {
    const link = notFound.shadowRoot.querySelector('.home-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/employee-list');
    expect(link.textContent).toBe('notFound.returnToHomepage');
    expect(originalTranslate).toHaveBeenCalledWith('notFound.returnToHomepage');
  });
});
