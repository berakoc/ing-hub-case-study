import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import './MainLayout';
import { translate as originalTranslate } from '@/lib';

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
  };
});

describe('MainLayout component', () => {
  let container;
  let layout;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<main-layout><div class="child-content">Hello</div></main-layout>`;
    layout = container.querySelector('main-layout');
    await layout.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders header with logo and company name', () => {
    const logo = layout.shadowRoot.querySelector('.logo');
    const companyName = layout.shadowRoot.querySelector('.company-name');

    expect(logo).toBeTruthy();
    expect(logo.getAttribute('src')).toBe('/ing-logo.png');
    expect(companyName).toBeTruthy();
    expect(companyName.textContent).toBe('ING');
  });

  it('renders employee list and add new links with translated text', () => {
    const employeeLink = layout.shadowRoot.querySelector('.employee-list-action span');
    const addNewLink = layout.shadowRoot.querySelector('.add-new-action span');

    expect(employeeLink).toBeTruthy();
    expect(employeeLink.textContent).toBe('mainLayout.header.employees');
    expect(addNewLink).toBeTruthy();
    expect(addNewLink.textContent).toBe('mainLayout.header.addNew');

    expect(originalTranslate).toHaveBeenCalledWith('mainLayout.header.employees');
    expect(originalTranslate).toHaveBeenCalledWith('mainLayout.header.addNew');
  });

  it('renders language-select component', () => {
    const langSelect = layout.shadowRoot.querySelector('language-select');
    expect(langSelect).toBeTruthy();
  });

  it('renders slot content', () => {
    const slot = layout.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();

    const assignedNodes = slot.assignedNodes({ flatten: true });
    expect(assignedNodes.some((node) => node.classList?.contains('child-content'))).toBe(true);
  });
});
