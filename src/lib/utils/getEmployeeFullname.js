export class CannotGetFullnameError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CannotGetFullnameError';
  }
}

export function getEmployeeFullname(employee) {
  if (!employee.firstName && !employee.lastName) {
    throw new CannotGetFullnameError('Cannot get fullname due to empty employee object');
  }
  return `${employee.firstName} ${employee.lastName}`;
}
