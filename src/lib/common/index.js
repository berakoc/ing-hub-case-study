import z from 'zod';

export const EventType = {
  MyElementClick: 'my-element-click',
};

export const LanguageFlagMap = {
  en: '/uk-flag.svg',
  tr: '/turkey-flag.svg',
};

export const TABLE_ITEMS_PER_PAGE = 10;
export const CARD_LIST_ITEMS_PER_PAGE = 4;

export const Path = {
  EmployeeList: '/employee-list',
  AddEmployee: '/add-employee',
  EditEmployee: '/edit-employee/:employeeId',
};

const phonePattern = /^\+\(\d{1,3}\) \d{3} \d{3} \d{2} \d{2}$/;

export const employeeSchema = z.object({
  firstName: z.string().min(2, { error: 'employee.errors.firstNameMinError' }),
  lastName: z.string().min(2, { error: 'employee.errors.lastNameMinError' }),
  dateOfEmployment: z.string().nonempty({ error: 'employee.errors.emptyDateOfEmployment' }),
  dateOfBirth: z.string().nonempty({ error: 'employee.errors.dateOfBirth' }),
  phone: z.string().regex(phonePattern, { error: 'employee.errors.phone' }),
  email: z.email({ message: 'employee.errors.email' }),
  department: z.string().min(2, { error: 'employee.errors.departmentMinError' }),
  position: z.string().min(2, { error: 'employee.errors.positionNotSelectedError' }),
});
