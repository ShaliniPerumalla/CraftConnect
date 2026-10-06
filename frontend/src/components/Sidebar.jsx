import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const menus = {
  customer: [
    { label: "Dashboard", to: "/profile" },
    { label: "Requirements", to: "/requirements" },
    { label: "Orders", to: "/orders" },
    { label: "Messages", to: "/chat" },
    { label: "Notifications", to: "/notifications" },
  ],

  creator: [
    { label: "Dashboard", to: "/creator-dashboard" },
    { label: "My Crafts", to: "/creator/crafts" },
    { label: "Orders", to: "/creator/orders" },
    { label: "Messages", to: "/chat" },
  ],

  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Complaints", to: "/admin/complaints" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();

  const items = menus[user?.role] || [];

  return (
    <aside className="w-64 bg-white border-r border-border p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 ${
                isActive
                  ? "bg-amber/10 text-amber"
                  : "text-ink-soft hover:bg-cream"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}