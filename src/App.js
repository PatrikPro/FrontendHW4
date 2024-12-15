import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShoppingListsOverview from './components/ShoppingListsOverview';
import ShoppingListDetail from './components/ShoppingListDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShoppingListsOverview />} />
        <Route path="/lists/:id" element={<ShoppingListDetail />} />
      </Routes>
    </Router>
  );
}

export default App;




