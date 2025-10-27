import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import '../EmployeeList';

const deleteEmployeeSpy = vi.fn();
const deleteSelectedEmployeesSpy = vi.fn();

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
    getEmployeeFullname: vi.fn((employee) => `${employee.firstName} ${employee.lastName}`),
    TABLE_ITEMS_PER_PAGE: 5,
    CARD_LIST_ITEMS_PER_PAGE: 2,
    ViewMode: { Table: 'table', CardList: 'card-list' },
    computeTotalPages: (length, perPage) => Math.ceil(length / perPage),
    getEmployeeSearchResults: vi.fn((employees, searchTerm) =>
      employees.filter((e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    store: {
      subscribe: vi.fn(),
      getState: vi.fn(() => ({
        employees: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Smith' },
          { id: 3, firstName: 'Jim', lastName: 'Beam' },
          { id: 4, firstName: 'Alice', lastName: 'Brown' },
          { id: 5, firstName: 'Bob', lastName: 'White' },
          { id: 6, firstName: 'Sara', lastName: 'Connor' },
        ],
        deleteEmployee: deleteEmployeeSpy,
        deleteSelectedEmployees: deleteSelectedEmployeesSpy,
      })),
    },
  };
});

vi.mock('lodash.debounce', () => ({
  default: (fn) => {
    fn.cancel = vi.fn();
    fn.flush = vi.fn();
    return fn;
  },
}));

describe('EmployeeList', () => {
  let list;

  beforeEach(async () => {
    document.body.innerHTML = `<employee-list></employee-list>`;
    list = document.querySelector('employee-list');
    await list.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('opens delete modal when open-delete-employee-modal is dispatched', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    list._openDeleteEmployeeModal({ detail: { selectedEmployee: employee } });
    await list.updateComplete;

    expect(list.isDeleteEmployeeModalOpen).toBe(true);
    expect(list.selectedEmployee).toEqual(employee);
  });

  it('closes delete modal when _closeDeleteEmployeeModal is called', async () => {
    list.isDeleteEmployeeModalOpen = true;
    list._closeDeleteEmployeeModal();
    await list.updateComplete;

    expect(list.isDeleteEmployeeModalOpen).toBe(false);
  });

  it('deletes employee when _deleteEmployee is called', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    list.selectedEmployee = employee;
    list._deleteEmployee();
    expect(deleteEmployeeSpy).toHaveBeenCalledWith(1);
    expect(list.isDeleteEmployeeModalOpen).toBe(false);
  });

  it('opens and deletes multiple selected employees', async () => {
    list._openDeleteEmployeeModalForSelectedEmployees({
      detail: { selectedEmployeeIds: [1, 2] },
    });
    expect(list.isDeleteEmployeeModalOpen).toBe(true);
    expect(list.selectedEmployeeIds).toEqual([1, 2]);

    list._deleteSelectedEmployees();
    expect(deleteSelectedEmployeesSpy).toHaveBeenCalledWith([1, 2]);
    expect(list.selectedEmployeeIds).toEqual([]);
  });

  it('switches view modes when clicking icons', async () => {
    const tableIcon = list.shadowRoot.querySelector('.view-options ph-list');
    const cardIcon = list.shadowRoot.querySelector('.view-options ph-squares-four');

    fireEvent.click(cardIcon);
    await list.updateComplete;
    expect(list.viewMode).toBe('card-list');

    fireEvent.click(tableIcon);
    await list.updateComplete;
    expect(list.viewMode).toBe('table');
  });

  it('updates currentPage when page-changed event fired', async () => {
    const pagination = list.shadowRoot.querySelector('ing-pagination');
    pagination.dispatchEvent(
      new CustomEvent('page-changed', {
        bubbles: true,
        composed: true,
        detail: { currentPage: 2 },
      })
    );
    await list.updateComplete;
    expect(list.currentPage).toBe(2);
  });

  it('renders delete modal only when open', async () => {
    expect(list.shadowRoot.querySelector('delete-employee-modal')).toBeNull();

    list.isDeleteEmployeeModalOpen = true;
    list.selectedEmployee = { firstName: 'John', lastName: 'Doe' };
    await list.updateComplete;

    expect(list.shadowRoot.querySelector('delete-employee-modal')).not.toBeNull();
  });

  it('handles search input and filters employees correctly', async () => {
    const input = list.shadowRoot.querySelector('ing-text-input');
    fireEvent.input(input, { target: { value: 'john' } });

    await list.updateComplete;
    await list._handleSearch();

    expect(list.filteredEmployees.length).toBe(1);
    expect(list.filteredEmployees[0].firstName).toBe('John');
  });

  it('resets currentPage when search triggered', async () => {
    list.currentPage = 3;
    list.searchTerm = 'smith';
    await list._handleSearch();
    expect(list.currentPage).toBe(1);
  });

  it('computes totalPages properly for card and table modes', async () => {
    let totalPages = list.shadowRoot.querySelector('ing-pagination')?.totalPages;
    expect(totalPages).toBe(2);

    list.viewMode = 'card-list';
    await list.updateComplete;
    totalPages = list.shadowRoot.querySelector('ing-pagination')?.totalPages;
    expect(totalPages).toBe(3);
  });

  it('throws error on invalid view mode', async () => {
    list.viewMode = 'unknown';
    await expect(async () => list.updateComplete).rejects.toThrow(/Unknown view mode/);
  });

  it('calls unsubscribe in disconnectedCallback', async () => {
    const unsubscribeSpy = vi.fn();
    list.unsubscribe = unsubscribeSpy;
    list.disconnectedCallback();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('does not render pagination if only one page', async () => {
    list.filteredEmployees = [{ id: 1, firstName: 'Solo', lastName: 'User' }];
    await list.updateComplete;
    const pagination = list.shadowRoot.querySelector('ing-pagination');
    expect(pagination).toBeNull();
  });
});
