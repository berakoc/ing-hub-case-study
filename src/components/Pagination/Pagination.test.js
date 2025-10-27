import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './Pagination';

describe('Pagination component', () => {
  let container;
  let pagination;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<ing-pagination></ing-pagination>`;
    pagination = container.querySelector('ing-pagination');
    await pagination.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders the initial page buttons', async () => {
    const buttons = pagination.shadowRoot.querySelectorAll('.page-button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0].textContent.trim()).toBe('1');
  });

  it('next button increments currentPage', async () => {
    const nextBtn = pagination.shadowRoot.querySelector('.next-button');
    const spy = vi.fn();
    pagination.addEventListener('page-changed', spy);

    fireEvent.click(nextBtn);
    await pagination.updateComplete;

    expect(pagination.currentPage).toBe(2);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.currentPage).toBe(2);
  });

  it('prev button decrements currentPage', async () => {
    pagination.currentPage = 3;
    await pagination.updateComplete;

    const prevBtn = pagination.shadowRoot.querySelector('.prev-button');
    const spy = vi.fn();
    pagination.addEventListener('page-changed', spy);

    fireEvent.click(prevBtn);
    await pagination.updateComplete;

    expect(pagination.currentPage).toBe(2);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.currentPage).toBe(2);
  });

  it('page buttons set currentPage correctly', async () => {
    await pagination.updateComplete;

    const pageButtons = Array.from(pagination.shadowRoot.querySelectorAll('.page-button'));
    const spy = vi.fn();
    pagination.addEventListener('page-changed', spy);

    const page3Btn = pageButtons.find((btn) => btn.textContent.trim() === '3');
    expect(page3Btn).toBeTruthy();

    fireEvent.click(page3Btn);
    await pagination.updateComplete;

    expect(pagination.currentPage).toBe(3);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail.currentPage).toBe(3);
  });

  it('disables prev button on first page and next button on last page', async () => {
    pagination.currentPage = 1;
    await pagination.updateComplete;
    expect(pagination.shadowRoot.querySelector('.prev-button').disabled).toBe(true);

    pagination.currentPage = pagination.totalPages;
    await pagination.updateComplete;
    expect(pagination.shadowRoot.querySelector('.next-button').disabled).toBe(true);
  });
});
