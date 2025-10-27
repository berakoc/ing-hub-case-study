import { describe, it, expect } from 'vitest';
import { formatDateToDefault, parseDate } from './dateFormatters';

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

describe('parseDate', () => {
  it('returns null for null, undefined, or empty string', () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate('   ')).toBeNull();
  });

  it('returns a valid Date object when given a Date input', () => {
    const d = new Date(2025, 9, 27);
    const result = parseDate(d);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(27);
  });

  it('returns null for invalid Date object', () => {
    const d = new Date('invalid date');
    expect(parseDate(d)).toBeNull();
  });

  it('parses ISO format YYYY-MM-DD', () => {
    const dateStr = '2025-10-27';
    const result = parseDate(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(27);
  });

  it('parses DD/MM/YYYY format', () => {
    const dateStr = '27/10/2025';
    const result = parseDate(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(27);
  });

  it('parses DD.MM.YYYY format', () => {
    const dateStr = '27.10.2025';
    const result = parseDate(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(27);
  });

  it('parses DD-MM-YYYY format', () => {
    const dateStr = '27-10-2025';
    const result = parseDate(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(27);
  });

  it('returns null for invalid strings', () => {
    expect(parseDate('99/99/9999')).toBeNull();
    expect(parseDate('abcd-ef-gh')).toBeNull();
    expect(parseDate('2025-13-01')).toBeNull();
    expect(parseDate('2025-00-01')).toBeNull();
    expect(parseDate('2025-01-32')).toBeNull();
  });

  it('handles leap year dates correctly', () => {
    expect(parseDate('29/02/2024')).toBeInstanceOf(Date);
    expect(parseDate('29/02/2024').getFullYear()).toBe(2024);
    expect(parseDate('29/02/2023')).toBeNull();
  });
});
