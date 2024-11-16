// src/Routes.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyclesList from "./Pages/Dashboard";
import CustomerForm from "./Pages/CustomerForm";
import ProductForm from "./Pages/CycleForm";
import BikePresentation from "./Pages/Presentation";
import CartPage from "./Pages/Cart";
import AdminPanel from "./Pages/Admin/Dashboard";
import NavbarWrapper from "./Pages/Components/Navbar";
import ErrorBoundary from "./Pages/Components/ErrorBoundary";

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <NavbarWrapper>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <CyclesList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/customer-form"
            element={
              <ErrorBoundary>
                <CustomerForm
                  isCheckoutPage={false}
                  onFormDataChange={() => {}}
                  onValidationChange={() => {}}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path="/cycle-form"
            element={
              <ErrorBoundary>
                <ProductForm mode="add" product={null} onClose={() => {}} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/presentation"
            element={
              <ErrorBoundary>
                <BikePresentation />
              </ErrorBoundary>
            }
          />
          <Route
            path="/cart"
            element={
              <ErrorBoundary>
                <CartPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/admin/"
            element={
              <ErrorBoundary>
                <AdminPanel />
              </ErrorBoundary>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </NavbarWrapper>
    </Router>
  );
};

export default RoutesComponent;
