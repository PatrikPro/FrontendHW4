import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddListModal from "./AddListModal";
import ConfirmationDialog from "./ConfirmationDialog";
import "./ShoppingListsOverview.css";

const BASE_URL = "http://localhost:5000"; // Backend base URL
const currentUser = { id: "user1", name: "Owner User" }; // Mock current user

function ShoppingListsOverview() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);
  const [filterArchived, setFilterArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch shopping lists from backend
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/shopping-lists`);
        if (!response.ok) {
          throw new Error("Failed to fetch shopping lists");
        }
        const data = await response.json();
        setShoppingLists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  // Toggle archive status of a list
  const toggleArchiveList = async (listId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, isArchived: !list.isArchived } : list
      )
    );
    console.log(`Toggled archive status for list ID: ${listId}`);
  };

  // Delete a list
  const deleteList = async (listId) => {
    setShoppingLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    setShowConfirm(null);
    console.log(`Deleted list ID: ${listId}`);
  };

  // Add a new list
  const addNewList = (listName) => {
    const newList = {
      id: Date.now().toString(),
      name: listName,
      isArchived: false,
      owner: currentUser.id,
    };
    setShoppingLists((prevLists) => [...prevLists, newList]);
    setShowModal(false);
  };

  // Filter shopping lists based on archived status
  const filteredLists = shoppingLists.filter((list) =>
    filterArchived ? true : !list.isArchived
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overview-container">
      <header className="header">
        <h1 className="header-title">My Shopping Lists</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Add List
        </button>
      </header>

      {/* Checkbox to filter archived lists */}
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={filterArchived}
            onChange={() => setFilterArchived(!filterArchived)}
          />
          Show Archived Lists
        </label>
      </div>

      {/* List of Shopping Lists */}
      <div className="tiles-container">
        {filteredLists.map((list) => (
          <div
            key={list.id}
            className={`list-tile ${list.isArchived ? "archived" : ""}`}
            onClick={() => navigate(`/lists/${list.id}`)}
          >
            {/* Archive/Unarchive Button */}
            {list.owner === currentUser.id && (
              <button
                className="archive-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArchiveList(list.id);
                }}
                title={list.isArchived ? "Unarchive List" : "Archive List"}
              >
                📦
              </button>
            )}

            {/* List Title */}
            <h2>{list.name}</h2>

            {/* Delete Button */}
            {list.owner === currentUser.id && (
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(list.id);
                }}
                title="Delete List"
              >
                🗑
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New List Modal */}
      {showModal && (
        <AddListModal onAddList={addNewList} onClose={() => setShowModal(false)} />
      )}

      {/* Confirmation Dialog for Deletion */}
      {showConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this list?"
          onConfirm={() => deleteList(showConfirm)}
          onCancel={() => setShowConfirm(null)}
        />
      )}
    </div>
  );
}

export default ShoppingListsOverview;
