import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import './EmployeeTable';
import { Router } from '@vaadin/router';

vi.mock('@/lib', async () => {
  const actual = await vi.importActual('@/lib');
  return {
    ...actual,
    translate: vi.fn((key) => key),
    formatDateToDefault: vi.fn((date) => date),
    TABLE_ITEMS_PER_PAGE: 5,
    Path: { EditEmployee: '/employees/:employeeId/edit' },
  };
});

vi.mock('@vaadin/router', () => ({
  Router: { go: vi.fn() },
}));

describe('EmployeeTable', () => {
  let container;
  let table;
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
      dateOfEmployment: '2021-01-01',
      dateOfBirth: '1992-01-01',
      phone: '456',
      email: 'jane@example.com',
      department: 'HR',
      position: 'Manager',
    },
  ];

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<ing-employee-table></ing-employee-table>`;
    table = container.querySelector('ing-employee-table');
    table.employees = employees;
    table.currentPage = 1;
    await table.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('renders correct number of rows', async () => {
    const rows = table.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(employees.length);
  });

  it('renders correct employee data in first row', async () => {
    const firstRowCells = table.shadowRoot.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[1].textContent).toBe('John');
    expect(firstRowCells[2].textContent).toBe('Doe');
    expect(firstRowCells[3].textContent).toBe('2020-01-01');
    expect(firstRowCells[4].textContent).toBe('1990-01-01');
  });

  it('clicking edit button calls Router.go with correct employee ID', async () => {
    const editButton = table.shadowRoot.querySelector('.edit-button');
    fireEvent.click(editButton);
    expect(Router.go).toHaveBeenCalledWith('/employees/1/edit');
  });

  it('dispatches "open-delete-employee-modal" with employee on delete button click', async () => {
    const spy = vi.fn();
    table.addEventListener('open-delete-employee-modal', spy);
    const firstDeleteButton = table.shadowRoot.querySelector('.delete-button');
    fireEvent.click(firstDeleteButton);
    await table.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
    const eventDetail = spy.mock.calls[0][0].detail;
    expect(eventDetail.selectedEmployee).toEqual(employees[0]);
  });

  it('resets selectedEmployeesIds and areAllEmployeesSelected when currentPage changes', async () => {
    table.selectedEmployeesIds = [1];
    table.areAllEmployeesSelected = true;
    table.currentPage = 2;
    await table.updateComplete;
    expect(table.selectedEmployeesIds).toEqual([]);
    expect(table.areAllEmployeesSelected).toBe(false);
  });

  it('handles individual checkbox selection and deselection', async () => {
    const firstCheckbox = table.shadowRoot.querySelectorAll('ing-checkbox')[1];
    firstCheckbox.dispatchEvent(new CustomEvent('checkbox-change', { detail: { checked: true } }));
    await table.updateComplete;
    expect(table.selectedEmployeesIds).toContain(1);

    firstCheckbox.dispatchEvent(new CustomEvent('checkbox-change', { detail: { checked: false } }));
    await table.updateComplete;
    expect(table.selectedEmployeesIds).not.toContain(1);
  });

  it('handles select all checkbox check', async () => {
    const headerCheckbox = table.shadowRoot.querySelector('thead ing-checkbox');
    headerCheckbox.dispatchEvent(new CustomEvent('checkbox-change', { detail: { checked: true } }));
    await table.updateComplete;

    const expectedIds = employees.slice(0, 5).map((e) => e.id);
    expect(table.selectedEmployeesIds).toEqual(expectedIds);
    expect(table.areAllEmployeesSelected).toBe(true);
  });

  it('handles select all checkbox uncheck (clears current page ids)', async () => {
    const headerCheckbox = table.shadowRoot.querySelector('thead ing-checkbox');
    headerCheckbox.dispatchEvent(new CustomEvent('checkbox-change', { detail: { checked: true } }));
    await table.updateComplete;
    headerCheckbox.dispatchEvent(
      new CustomEvent('checkbox-change', { detail: { checked: false } })
    );
    await table.updateComplete;
    expect(table.selectedEmployeesIds).toEqual([]);
    expect(table.areAllEmployeesSelected).toBe(false);
  });

  it('dispatches event for deleting selected employees', async () => {
    table.selectedEmployeesIds = [1, 2];
    await table.updateComplete;
    const deleteSelectedSpy = vi.fn();
    table.addEventListener('open-delete-employee-modal-for-selected-employees', deleteSelectedSpy);

    const deleteSelectedButton = table.shadowRoot.querySelector('ing-button');
    fireEvent.click(deleteSelectedButton);
    await table.updateComplete;

    expect(deleteSelectedSpy).toHaveBeenCalledTimes(1);
    const detail = deleteSelectedSpy.mock.calls[0][0].detail;
    expect(detail.selectedEmployeeIds).toEqual([1, 2]);
  });

  it('renders empty table message when no employees', async () => {
    table.employees = [];
    await table.updateComplete;
    const emptyMessage = table.shadowRoot.querySelector('.empty-table-container p');
    expect(emptyMessage.textContent).toContain('employeeList.noEmployeesFound');
  });

  it('dispatches "open-delete-employee-modal" with employee on delete button click', async () => {
    const spy = vi.fn();
    table.addEventListener('open-delete-employee-modal', spy);

    const firstDeleteButton = table.shadowRoot.querySelector('.delete-button');
    await table.updateComplete;
    fireEvent.click(firstDeleteButton);

    await Promise.resolve();
    await Promise.resolve();

    expect(spy).toHaveBeenCalledTimes(1);
    const eventDetail = spy.mock.calls[0][0].detail;
    expect(eventDetail.selectedEmployee).toEqual(employees[0]);
  });
});
