import { describe, it, expect } from 'vitest';
import { isEmailUnique } from './isEmailUnique';

describe('isEmailUnique', () => {
  const employees = [{ email: 'john@example.com' }, { email: 'jane@example.com' }];

  it('should return true if email is unique', () => {
    expect(isEmailUnique('unique@example.com', employees)).toBe(true);
  });

  it('should return false if email already exists', () => {
    expect(isEmailUnique('john@example.com', employees)).toBe(false);
  });

  it('should return true if employee list is empty', () => {
    expect(isEmailUnique('new@example.com', [])).toBe(true);
  });

  it('should be case-sensitive when comparing emails', () => {
    expect(isEmailUnique('John@example.com', employees)).toBe(true);
  });
});
