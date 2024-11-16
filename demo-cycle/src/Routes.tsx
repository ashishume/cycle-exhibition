// src/Routes.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyclesList from "./Pages/Dashboard";
import CustomerForm from "./Pages/CustomerForm";
import ProductForm from "./Pages/CycleForm";
import BikePresentation from "./Pages/Presentation";
import CartPage from "./Pages/Cart";
import AdminPanel from "./Pages/Admin/Dashboard";

// Import your page components

// You can define your routes here
const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<CyclesList />} />
        <Route
          path="/customer-form"
          element={
            <CustomerForm
              onFormDataChange={() => {}}
              onValidationChange={() => {}}
            />
          }
        />
        <Route
          path="/cycle-form"
          element={<ProductForm mode="add" product={null} onClose={() => {}} />}
        />
        <Route path="/presentation" element={<BikePresentation />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin/" element={<AdminPanel />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
