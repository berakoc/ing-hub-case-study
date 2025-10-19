import { describe, it, expect } from 'vitest';
import { formatDateToDefault } from './dateFormatters';

describe('Test Date Formatters', () => {
  it('should format a standard date correctly', () => {
    const date = '2025-10-19';
    const formatted = formatDateToDefault(date);
    expect(formatted).toBe('19/10/2025');
  });

  it('should format a Date object correctly', () => {
    const date = new Date(2025, 9, 19);
    const formatted = formatDateToDefault(date);
    expect(formatted).toBe('19/10/2025');
  });

  it('should handle invalid date strings gracefully', () => {
    const formatted = formatDateToDefault('invalid-date');
    expect(formatted).toBe('Invalid Date');
  });
});
