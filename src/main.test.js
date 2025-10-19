import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

let resolveI18n;
const i18nInitMock = new Promise((resolve) => {
  resolveI18n = resolve;
});

vi.mock('./i18n', () => ({
  i18nInit: i18nInitMock,
}));

const setRoutesMock = vi.fn();
const RouterMock = vi.fn(() => ({ setRoutes: setRoutesMock }));

vi.mock('@vaadin/router', () => ({
  Router: RouterMock,
}));

let appDiv;

beforeEach(() => {
  appDiv = document.createElement('div');
  appDiv.id = 'app';
  document.body.appendChild(appDiv);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
  setRoutesMock.mockReset();
  RouterMock.mockReset();
});

describe('main.js router setup', () => {
  it('initializes Router after i18nInit resolves', async () => {
    await import('./main.js');

    expect(RouterMock).not.toHaveBeenCalled();

    resolveI18n();

    await i18nInitMock;

    expect(RouterMock).toHaveBeenCalledWith(appDiv);
    expect(setRoutesMock).toHaveBeenCalled();
  });
});
