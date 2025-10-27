export function isEmailUnique(email, employees) {
  return !employees.some((employee) => employee.email === email);
}
