import { employeePositions } from '../store/data';

export const getEmployeePosition = ({ employee, translate }) => {
  const foundPosition = translate(
    employeePositions.find((position) => position.value === employee.position)?.labelKey
  );

  return foundPosition ?? employee.position;
};
