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
import OrderSuccessPage from "./Pages/Order-Success";
import AdminLogin from "./Pages/Admin/AdminLogin";
import { AuthProvider, ProtectedRoute } from "./Pages/Admin/AdminAuthContext";

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
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
                    isAdminPage={false}
                    isCheckoutPage={false}
                    isEdit={false}
                    customerData={null}
                    onClose={null}
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
              path="/presentation/:id"
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
              path="/admin/login"
              element={
                <ErrorBoundary>
                  <AdminLogin />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin"
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                </ErrorBoundary>
              }
            />
            <Route
              path="/order-success"
              element={
                <ErrorBoundary>
                  <OrderSuccessPage />
                </ErrorBoundary>
              }
            />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </NavbarWrapper>
      </AuthProvider>
    </Router>
  );
};

export default RoutesComponent;
