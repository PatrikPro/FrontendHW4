import USE_MOCK_API from './config';
import * as mockApi from './mockApi';

const BASE_URL = 'http://localhost:5000/api'; 

const realApi = {
  fetchShoppingLists: async () => {
    const response = await fetch(`${BASE_URL}/shopping-lists`);
    return response.json();
  },
  fetchListItems: async (listId) => {
    const response = await fetch(`${BASE_URL}/shopping-lists/${listId}/items`);
    return response.json();
  },
  addShoppingList: async (newList) => {
    const response = await fetch(`${BASE_URL}/shopping-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newList),
    });
    return response.json();
  },
  deleteShoppingList: async (listId) => {
    const response = await fetch(`${BASE_URL}/shopping-lists/${listId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

const api = USE_MOCK_API ? mockApi : realApi;

export default api;
