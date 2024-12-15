import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MemberManagement from "./MemberManagement";
import "./ShoppingListDetail.css";

const currentUser = { id: "user1", name: "Owner User" };

function ShoppingListDetail() {
  const { id } = useParams(); // Fetch list ID from URL
  const navigate = useNavigate();
  const [listData, setListData] = useState(null); // Shopping list data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("all"); // Filter state

  // Fetch shopping list data from backend
  useEffect(() => {
    const fetchListData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/shopping-lists/${id}`);
        if (!response.ok) throw new Error("Failed to fetch shopping list data");
        const data = await response.json();
        setListData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListData();
  }, [id]);

  const isOwner = listData?.owner?.id === currentUser.id;

  // Toggle item resolved state
  const toggleItemResolved = (itemId) => {
    setListData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, isResolved: !item.isResolved } : item
      ),
    }));
  };

  // Add new item
  const addItem = () => {
    if (!newItem.trim()) return;
    const newItemObj = { id: Date.now().toString(), name: newItem, isResolved: false };
    setListData((prev) => ({
      ...prev,
      items: [...prev.items, newItemObj],
    }));
    setNewItem("");
  };

  // Edit list name
  const editListName = (newName) => {
    if (isOwner) {
      setListData((prev) => ({ ...prev, name: newName }));
      setIsEditingName(false);
    }
  };

  // Add member
  const addMember = (email) => {
    const newMember = { id: Date.now().toString(), name: email.split("@")[0] };
    setListData((prev) => ({ ...prev, members: [...prev.members, newMember] }));
  };

  // Remove member
  const removeMember = (memberId) => {
    setListData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  };

  // Filter items
  const filteredItems = listData?.items.filter((item) => {
    if (filter === "unresolved") return !item.isResolved;
    if (filter === "resolved") return item.isResolved;
    return true;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shopping-list-container">
      {/* Header */}
      <header className="header">
        <span className="back-button" onClick={() => navigate("/")}>
          ←
        </span>
        {isEditingName ? (
          <input
            type="text"
            value={listData.name}
            onChange={(e) => editListName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
            autoFocus
            className="edit-list-name-input"
          />
        ) : (
          <h1 onClick={() => isOwner && setIsEditingName(true)}>
            {listData.name} {isOwner && "✏️"}
          </h1>
        )}
      </header>

      {/* Filters */}
      <div className="filter-container">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "unresolved" ? "active" : ""}`}
          onClick={() => setFilter("unresolved")}
        >
          Unresolved
        </button>
        <button
          className={`filter-button ${filter === "resolved" ? "active" : ""}`}
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* Items */}
      <div className="items-container">
        {filteredItems.map((item) => (
          <div key={item.id} className={`item-row ${item.isResolved ? "resolved" : ""}`}>
            <label>
              <input
                type="checkbox"
                checked={item.isResolved}
                onChange={() => toggleItemResolved(item.id)}
              />
              {item.name}
            </label>
            <button
              className="delete-item-button"
              onClick={() =>
                setListData((prev) => ({
                  ...prev,
                  items: prev.items.filter((i) => i.id !== item.id),
                }))
              }
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Add Item */}
      <div className="add-item-container">
        <input
          type="text"
          placeholder="Enter item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem} className="add-button">
          Add
        </button>
      </div>

      {/* Member Management */}
      <div className="member-management">
        <MemberManagement
          members={listData.members}
          onAddMember={isOwner ? addMember : null}
          onRemoveMember={isOwner ? removeMember : null}
          userId={currentUser.id}
        />
      </div>
    </div>
  );
}

export default ShoppingListDetail;
