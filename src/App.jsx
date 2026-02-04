import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Services from "./pages/Services";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Pricing from "./pages/Pricing";
import PricingDetails from "./pages/PricingDetails";
import Support from "./pages/Support";
import Team from "./pages/Team";
import HomeDashboard from "./pages/HomeDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute";
import DashboardApp from "./Dashboard/DashboardApp.jsx";
import { useDispatch } from "react-redux";
import { removeUser } from "./features/reducers/AuthSlice.jsx";
import { useEffect } from "react";
import { initAuth } from "./features/actions/AuthAction";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ Fetch authenticated user if token exists
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  useEffect(() => {
    const handler = () => {
      dispatch(removeUser(null));
      // optionally redirect to /login here using useNavigate
    };

    window.addEventListener("unauthorized", handler);
    return () => window.removeEventListener("unauthorized", handler);
  }, [dispatch]);

  // ✅ Hide Navbar & Footer on protected dashboard routes
  const hideNavbarFooter =
    location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/cms");

  return (
    <div className="min-h-screen">
      <div className={`min-h-screen ${hideNavbarFooter ? "" : "app-shell"}`.trim()}>
        {/* 👇 Conditionally render Navbar */}
        {!hideNavbarFooter && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/home-dashboard" element={<HomeDashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing-details" element={<PricingDetails />} />
            <Route path="/team" element={<Team />} />
            <Route path="/support" element={<Support />} />

            {/* Private / Dashboard Routes */}
            <Route
              path="/user-dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardApp />
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>

        {/* 👇 Conditionally render Footer */}
        {!hideNavbarFooter && <Footer />}
      </div>
    </div>
  );
}

export default App;
