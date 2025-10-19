export const ViewMode = {
  Table: 'table',
  CardList: 'card-list',
};

export const computeTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};
