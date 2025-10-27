import { describe, it, expect } from 'vitest';
import { isPhoneNumberUnique } from './isPhoneNumberUnique';

describe('isPhoneNumberUnique', () => {
  const employees = [{ phone: '1234567890' }, { phone: '9876543210' }];

  it('should return true if phone number is unique', () => {
    expect(isPhoneNumberUnique('5555555555', employees)).toBe(true);
  });

  it('should return false if phone number already exists', () => {
    expect(isPhoneNumberUnique('1234567890', employees)).toBe(false);
  });

  it('should return true if employee list is empty', () => {
    expect(isPhoneNumberUnique('1234567890', [])).toBe(true);
  });
});
