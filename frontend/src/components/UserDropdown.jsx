import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <span>{user.name}</span>
        <span>⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg p-2 z-50">

          <Link
            to="/profile"
            className="block px-3 py-2 rounded-lg hover:bg-cream"
          >
            Profile
          </Link>

          {user.role === "customer" && (
            <Link
              to="/orders"
              className="block px-3 py-2 rounded-lg hover:bg-cream"
            >
              My Orders
            </Link>
          )}

          {user.role === "creator" && (
            <Link
              to="/creator-dashboard"
              className="block px-3 py-2 rounded-lg hover:bg-cream"
            >
              Dashboard
            </Link>
          )}

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-lg hover:bg-cream"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-cream"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}