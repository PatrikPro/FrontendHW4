const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const shoppingLists = [
  {
    id: "1",
    name: "Groceries",
    owner: { id: "user1", name: "Owner User" },
    items: [
      { id: "item1", name: "Milk", isResolved: false },
      { id: "item2", name: "Bread", isResolved: false },
    ],
    members: [
      { id: "user1", name: "Owner User" },
      { id: "user2", name: "Member User" },
    ],
  },
  {
    id: "2",
    name: "Party Supplies",
    owner: { id: "user1", name: "Owner User" },
    items: [
      { id: "item1", name: "Chips", isResolved: false },
      { id: "item2", name: "Soda", isResolved: true },
    ],
    members: [
      { id: "user1", name: "Owner User" },
      { id: "user2", name: "Member User" },
    ],
  },
];

// Get all shopping lists
app.get("/shopping-lists", (req, res) => {
  res.json(shoppingLists);
});

// Get a specific shopping list by ID
app.get("/shopping-lists/:id", (req, res) => {
  const { id } = req.params;
  const list = shoppingLists.find((l) => l.id === id);
  if (list) {
    res.json(list);
  } else {
    res.status(404).json({ message: "Shopping list not found" });
  }
});

// Add a new shopping list
app.post("/shopping-lists", (req, res) => {
  const newList = {
    id: Date.now().toString(),
    name: req.body.name || "New List",
    owner: req.body.owner || { id: "user1", name: "Owner User" },
    items: [],
    members: [{ id: "user1", name: "Owner User" }],
  };
  shoppingLists.push(newList);
  res.status(201).json(newList);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
