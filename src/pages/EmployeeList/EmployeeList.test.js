import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import '../EmployeeList';

const deleteEmployeeSpy = vi.fn();

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
    getEmployeeFullname: vi.fn((employee) => `${employee.firstName} ${employee.lastName}`),
    TABLE_ITEMS_PER_PAGE: 5,
    CARD_LIST_ITEMS_PER_PAGE: 2,
    ViewMode: { Table: 'table', CardList: 'cardList' },
    computeTotalPages: (length, perPage) => Math.ceil(length / perPage),
    store: {
      subscribe: vi.fn(),
      getState: vi.fn(() => ({
        employees: [
          { id: 1, firstName: 'John', lastName: 'Doe' },
          { id: 2, firstName: 'Jane', lastName: 'Smith' },
        ],
        deleteEmployee: deleteEmployeeSpy,
      })),
    },
  };
});

describe('EmployeeList', () => {
  let list;

  beforeEach(async () => {
    document.body.innerHTML = `<employee-list></employee-list>`;
    list = document.querySelector('employee-list');
    await list.updateComplete;
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
    await list.updateComplete;

    list._closeDeleteEmployeeModal();
    await list.updateComplete;

    expect(list.isDeleteEmployeeModalOpen).toBe(false);
  });

  it('deletes employee on delete-employee event', async () => {
    const employee = { id: 1, firstName: 'John', lastName: 'Doe' };
    list.selectedEmployee = employee;
    list.isDeleteEmployeeModalOpen = true;
    await list.updateComplete;

    const modal = list.shadowRoot.querySelector('delete-employee-modal');
    fireEvent.click(modal.shadowRoot.querySelector('ing-button'));
    modal.dispatchEvent(new CustomEvent('delete-employee', { bubbles: true, composed: true }));
    await list.updateComplete;

    expect(list.isDeleteEmployeeModalOpen).toBe(false);
    expect(deleteEmployeeSpy).toHaveBeenCalledWith(1);
  });

  it('switches view mode when clicking icons', async () => {
    const tableIcon = list.shadowRoot.querySelector('.view-options ph-list');
    const cardIcon = list.shadowRoot.querySelector('.view-options ph-squares-four');

    fireEvent.click(cardIcon);
    await list.updateComplete;
    expect(list.viewMode).toBe('card-list');

    fireEvent.click(tableIcon);
    await list.updateComplete;
    expect(list.viewMode).toBe('table');
  });

  it('updates currentPage on page-changed event', async () => {
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
});
