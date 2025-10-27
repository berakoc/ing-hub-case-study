export function isPhoneNumberUnique(phoneNumber, employees) {
  return !employees.some((employee) => employee.phone === phoneNumber);
}
