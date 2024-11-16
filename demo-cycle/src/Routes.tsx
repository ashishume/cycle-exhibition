// src/Routes.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyclesList from "./Pages/Dashboard";
import CustomerForm from "./Pages/CustomerForm";
import ProductForm from "./Pages/CycleForm";
import BikePresentation from "./Pages/Presentation";
import CartPage from "./Pages/Cart";
import AdminPanel from "./Pages/Admin/Dashboard";
import Navbar from "./Pages/Components/Navbar";

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<CyclesList />} />
          <Route
            path="/customer-form"
            element={
              <CustomerForm
                isCheckoutPage={false}
                onFormDataChange={() => {}}
                onValidationChange={() => {}}
              />
            }
          />
          <Route
            path="/cycle-form"
            element={
              <ProductForm mode="add" product={null} onClose={() => {}} />
            }
          />
          <Route path="/presentation" element={<BikePresentation />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/" element={<AdminPanel />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default RoutesComponent;
