const MOCK_SHOPPING_LISTS = [
  {
    id: '1',
    name: 'Groceries',
    archived: false,
  },
  {
    id: '2',
    name: 'Party Supplies',
    archived: true,
  }
];

const MOCK_ITEMS = [
  { id: '1', name: 'Milk', isResolved: false },
  { id: '2', name: 'Eggs', isResolved: true },
];

export const fetchShoppingLists = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SHOPPING_LISTS), 500); // Simulate network latency
  });
};

export const fetchListItems = (listId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ITEMS), 500);
  });
};

export const addShoppingList = (newList) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: Date.now().toString(), ...newList }), 500);
  });
};

export const deleteShoppingList = (listId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};
