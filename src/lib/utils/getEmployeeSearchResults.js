export function getEmployeeSearchResults(employees, searchTerm) {
  const lowercasedSearchTerm = searchTerm.toLowerCase();
  return employees.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
      employee.lastName.toLowerCase().includes(lowercasedSearchTerm) ||
      employee.email.toLowerCase().includes(lowercasedSearchTerm) ||
      employee.phone.toLowerCase().includes(lowercasedSearchTerm)
    );
  });
}
