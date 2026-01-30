import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router";
import App from "./App";
import DashboardApp from "./Dashboard/DashboardApp";
import PrivateRoute from "./components/PrivateRoute";

const MainRoutes = () => {
  return (
    <Router>
    <Routes>
        {/* Routes from Landing App */}
        <Route path="/*" element={<App />} />

        {/* ✅ Protected CMS */}
        <Route
          path="/cms/*"
          element={
            <PrivateRoute>
              <DashboardApp />
            </PrivateRoute>
          }
        />

        {/* optional legacy path */}
        <Route path="/user-dashboard/*" element={<Navigate to="/cms" replace />} />
      </Routes>
    </Router>
  );
};

export default MainRoutes;
