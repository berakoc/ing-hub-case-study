import { describe, it, expect } from 'vitest';
import { getEmployeeFullname, CannotGetFullnameError } from './getEmployeeFullname';

describe('getEmployeeFullname', () => {
  it('returns full name for a valid employee', () => {
    const employee = { firstName: 'John', lastName: 'Doe' };
    const result = getEmployeeFullname(employee);
    expect(result).toBe('John Doe');
  });

  it('returns partial name if only one field is empty', () => {
    const employee1 = { firstName: '', lastName: 'Doe' };
    const employee2 = { firstName: 'John', lastName: '' };

    expect(getEmployeeFullname(employee1)).toBe(' Doe');
    expect(getEmployeeFullname(employee2)).toBe('John ');
  });

  it('throws CannotGetFullnameError if both firstName and lastName are missing', () => {
    const employee = {};
    expect(() => getEmployeeFullname(employee)).toThrow(CannotGetFullnameError);
    expect(() => getEmployeeFullname(employee)).toThrow(
      'Cannot get fullname due to empty employee object'
    );
  });

  it('throws CannotGetFullnameError if both firstName and lastName are empty strings', () => {
    const employee = { firstName: '', lastName: '' };
    expect(() => getEmployeeFullname(employee)).toThrow(CannotGetFullnameError);
  });
});
