import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router";
import App from "./App";
import DashboardApp from "./Dashboard/DashboardApp";
import PrivateRoute from "./components/PrivateRoute";
import RefundPolicy from "./pages/RefundPolicy";
import Disclaimer from "./pages/Disclaimer";
import CookiePolicy from "./pages/CookiePolicy";
import Terms from "./pages/Terms";


const MainRoutes = () => {
  return (
    <Router>
    <Routes>
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/cookies-policy" element={<CookiePolicy />} />
        <Route path="/terms" element={<Terms />} />

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
