import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './CardList';
import * as lib from '@/lib';

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
    formatDateToDefault: vi.fn((date) => `formatted-${date}`),
    CARD_LIST_ITEMS_PER_PAGE: 2,
  };
});

describe('CardList component', () => {
  let container;
  let cardList;
  const employees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01',
      phone: '123',
      email: 'john@example.com',
      department: 'IT',
      position: 'Developer',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfEmployment: '2019-05-05',
      dateOfBirth: '1988-05-05',
      phone: '456',
      email: 'jane@example.com',
      department: 'HR',
      position: 'Manager',
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Brown',
      dateOfEmployment: '2021-09-09',
      dateOfBirth: '1992-09-09',
      phone: '789',
      email: 'bob@example.com',
      department: 'Sales',
      position: 'Sales Rep',
    },
  ];

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<ing-card-list .employees=${JSON.stringify(employees)} .currentPage=1></ing-card-list>`;
    cardList = container.querySelector('ing-card-list');
    cardList.employees = employees;
    cardList.currentPage = 1;
    await cardList.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders the correct number of cards per page', () => {
    const cards = cardList.shadowRoot.querySelectorAll('.card');
    expect(cards.length).toBe(lib.CARD_LIST_ITEMS_PER_PAGE);
  });

  it('displays employee information correctly', () => {
    const firstCard = cardList.shadowRoot.querySelector('.card');
    expect(firstCard.textContent).toContain('employeeList.tableHeader.firstName');
    expect(firstCard.textContent).toContain('employeeList.tableHeader.lastName');
    expect(firstCard.textContent).toContain('formatted-2020-01-01'); // dateOfEmployment
    expect(firstCard.textContent).toContain('formatted-1990-01-01'); // dateOfBirth
  });

  it('dispatches "open-delete-employee-modal" with the correct employee', async () => {
    const spy = vi.fn();
    cardList.addEventListener('open-delete-employee-modal', spy);
    await cardList.updateComplete;

    const deleteButton = cardList.shadowRoot.querySelectorAll('ing-button')[1];
    fireEvent.click(deleteButton);
    await cardList.updateComplete;

    expect(spy).toHaveBeenCalledTimes(1);
    const eventDetail = spy.mock.calls[0][0].detail;
    expect(eventDetail.selectedEmployee).toEqual(employees[0]);
  });
});
