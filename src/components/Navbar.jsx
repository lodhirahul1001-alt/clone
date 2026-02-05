import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { removeUser } from "../features/reducers/AuthSlice";
import { logOutUserApi } from "../features/actions/AuthAction";
import CallbackModal from "./CallbackModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    "px-3 py-2 rounded-full text-sm font-medium transition-colors " +
    (isActive
      ? "text-[color:var(--text)] bg-black/5 dark:bg-white/10"
      : "text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/10");

  const onLogout = async () => {
    try {
      await dispatch(logOutUserApi());
    } finally {
      dispatch(removeUser(null));
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container-page py-4">
        <div className="glass flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full grid place-items-center border border-white/10 bg-white/5">
              <span className="text-neon font-bold">M</span>
            </div>
            <span className="font-semibold tracking-tight">
              <span className="sm:hidden">Music</span>
              <span className="hidden sm:inline">Music Platform</span>
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={linkClass}>
              Services
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/pricing" className={linkClass}>
              Pricing
            </NavLink>
            <NavLink to="/team" className={linkClass}>
              Team
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
            <NavLink to="/support" className={linkClass}>
              Support
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <button type="button" className="btn-ghost" onClick={() => setCallbackOpen(true)}>
              Request Callback
            </button>
            {isLoggedIn ? (
              <>
                <Link to="/user-dashboard" className="btn-primary">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <button className="btn-ghost" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
<button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 rounded-full grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="glass-soft mt-3 p-3 md:hidden">
            <div className="flex flex-col">
              <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
                About
              </NavLink>
              <NavLink to="/services" className={linkClass} onClick={() => setOpen(false)}>
                Services
              </NavLink>
              <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
                Projects
              </NavLink>
              <NavLink to="/pricing" className={linkClass} onClick={() => setOpen(false)}>
                Pricing
              </NavLink>
              <NavLink to="/team" className={linkClass} onClick={() => setOpen(false)}>
                Team
              </NavLink>
              <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
                Contact
              </NavLink>
              <NavLink to="/support" className={linkClass} onClick={() => setOpen(false)}>
                Support
              </NavLink>

              <div className="mt-3 flex gap-2">
                {isLoggedIn && user ? (
                  <>
                    <Link to="/user-dashboard" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                    <button className="btn-ghost flex-1" onClick={() => { setOpen(false); onLogout(); }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                )}
              </div>

              <button
                type="button"
                className="mt-2 btn-ghost"
                onClick={() => {
                  setOpen(false);
                  setCallbackOpen(true);
                }}
              >
                Request Callback
              </button>
            </div>
          </div>
        )}
      </div>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </header>
  );
}
