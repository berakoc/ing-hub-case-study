import { describe, it, expect } from 'vitest';
import { getEmployeeSearchResults } from './getEmployeeSearchResults';

describe('getEmployeeSearchResults', () => {
  const employees = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      position: 'Developer',
      department: 'Engineering',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@company.com',
      phone: '5551234567',
      position: 'Designer',
      department: 'Marketing',
    },
    {
      firstName: 'Ali',
      lastName: 'Yilmaz',
      email: 'ali@startup.io',
      phone: '9998887777',
      position: 'HR Manager',
      department: 'Human Resources',
    },
  ];

  it('should return matching employees by first name', () => {
    const results = getEmployeeSearchResults(employees, 'john');
    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe('John');
  });

  it('should return matching employees by last name', () => {
    const results = getEmployeeSearchResults(employees, 'smith');
    expect(results).toHaveLength(1);
    expect(results[0].lastName).toBe('Smith');
  });

  it('should return matching employees by email', () => {
    const results = getEmployeeSearchResults(employees, 'startup');
    expect(results).toHaveLength(1);
    expect(results[0].email).toBe('ali@startup.io');
  });

  it('should return multiple results if multiple fields match', () => {
    const results = getEmployeeSearchResults(employees, 'a');
    expect(results.length).toBeGreaterThan(1);
  });

  it('should return an empty array if no match is found', () => {
    const results = getEmployeeSearchResults(employees, 'xyz');
    expect(results).toEqual([]);
  });

  it('should be case-insensitive', () => {
    const results = getEmployeeSearchResults(employees, 'JOHN');
    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe('John');
  });
});
