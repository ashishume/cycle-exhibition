// src/Routes.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CyclesList from "./Pages/Dashboard";
import CustomerForm from "./Pages/CustomerForm";
import CycleForm from "./Pages/CycleForm";

// Import your page components

// You can define your routes here
const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<CyclesList />} />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route path="/cycle-form" element={<CycleForm />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
