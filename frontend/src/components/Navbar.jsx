import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  UserPlus,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { useState } from "react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import NotificationBell from "./notifications/NotificationBell";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { wishlistCount } = useWishlist();
  const { cartItems } = useCart();

  const cartCount =
    cartItems?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0;

  /* ======================================================
     ROLE-BASED NAVIGATION
  ====================================================== */

  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Explore",
      path: "/explore",
    },
    {
      label: "Categories",
      path: "/categories",
    },
    {
      label: "Creators",
      path: "/creators",
    },
  ];

  if (isAuthenticated && user?.role === "customer") {
    navItems.push(
      {
        label: "Custom Order",
        path: "/requirements",
      },
      {
        label: "Orders",
        path: "/orders",
      }
    );
  }

  if (isAuthenticated && user?.role === "creator") {
    navItems.push(
      {
        label: "My Crafts",
        path: "/creator/crafts",
      },
      {
        label: "Orders",
        path: "/creator/orders",
      }
    );
  }

  if (isAuthenticated && user?.role === "admin") {
    navItems.push({
      label: "Admin",
      path: "/admin",
    });
  }

  /* ======================================================
     HELPERS
  ====================================================== */

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setProfileOpen(false);
    closeMobileMenu();
    navigate("/login");
  }

  function getDashboardPath() {
    if (user?.role === "creator") {
      return "/creator-dashboard";
    }

    if (user?.role === "admin") {
      return "/admin";
    }

    return "/profile";
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-cream/95
        backdrop-blur-xl
        border-b
        border-border
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            h-16
            lg:h-20
            flex
            items-center
            justify-between
            gap-4
          "
        >

          {/* ======================================================
              LOGO
          ====================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="
              font-display
              text-2xl
              sm:text-3xl
              text-ink
              shrink-0
              tracking-tight
            "
          >
            Craft
            <span className="text-amber">
              Connect
            </span>
          </Link>

          {/* ======================================================
              DESKTOP NAV
          ====================================================== */}

          <nav
            className="
              hidden
              xl:flex
              items-center
              gap-5
            "
          >

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-ink font-semibold"
                      : "text-ink-soft hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

          </nav>

          {/* ======================================================
              DESKTOP ACTIONS
          ====================================================== */}

          <div
            className="
              hidden
              xl:flex
              items-center
              gap-2
              shrink-0
            "
          >

            {/* Logged-in controls */}
            {isAuthenticated ? (
              <>
                <NotificationBell />

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                    hover:text-rose
                    transition-colors
                  "
                  aria-label="Liked crafts"
                  title="Liked Crafts"
                >
                  <Heart
                    size={19}
                    className={
                      wishlistCount > 0
                        ? "text-rose fill-rose"
                        : ""
                    }
                  />

                  {wishlistCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-1
                        -right-1
                        min-w-[18px]
                        h-[18px]
                        px-1
                        rounded-full
                        bg-rose
                        text-white
                        text-[10px]
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                    hover:text-ink
                    transition-colors
                  "
                  aria-label="Shopping cart"
                  title="Shopping Cart"
                >
                  <ShoppingBag size={19} />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-1
                        -right-1
                        min-w-[18px]
                        h-[18px]
                        px-1
                        rounded-full
                        bg-amber-dark
                        text-white
                        text-[10px]
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile dropdown */}
                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((previous) => !previous)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      rounded-full
                      hover:bg-white
                      transition-colors
                    "
                  >
                    <span
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-forest
                        text-cream
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <UserRound size={18} />
                    </span>

                    <span className="text-sm font-medium text-ink max-w-[100px] truncate">
                      {user?.name || "Account"}
                    </span>

                    <ChevronDown
                      size={16}
                      className="text-ink-soft"
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-14
                        w-56
                        bg-white
                        border
                        border-border
                        rounded-2xl
                        shadow-lg
                        p-2
                        z-50
                      "
                    >

                      <div className="px-3 py-3 border-b border-border mb-1">
                        <p className="text-sm font-semibold text-ink truncate">
                          {user?.name || "User"}
                        </p>

                        <p className="text-xs text-ink-soft truncate">
                          {user?.email || ""}
                        </p>

                        <p className="text-xs text-amber-dark capitalize mt-1">
                          {user?.role || "customer"}
                        </p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-xl
                          text-sm
                          text-ink-soft
                          hover:bg-cream
                          hover:text-ink
                        "
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-xl
                          text-sm
                          text-ink-soft
                          hover:bg-cream
                          hover:text-ink
                        "
                      >
                        <UserRound size={17} />
                        My Profile
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-xl
                          text-sm
                          text-red-600
                          hover:bg-red-50
                        "
                      >
                        <LogOut size={17} />
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-full
                    bg-ink
                    text-cream
                    text-sm
                    font-medium
                    hover:bg-amber-dark
                    transition-colors
                  "
                >
                  <LogIn size={15} />
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-full
                    bg-forest
                    text-white
                    text-sm
                    font-medium
                    hover:opacity-90
                    transition-all
                  "
                >
                  <UserPlus size={15} />
                  Register
                </Link>
              </>
            )}

          </div>

          {/* ======================================================
              MOBILE ACTIONS
          ====================================================== */}

          <div
            className="
              flex
              xl:hidden
              items-center
              gap-1
            "
          >

            {isAuthenticated && (
              <>
                <NotificationBell />

                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                  "
                  aria-label="Liked crafts"
                >
                  <Heart
                    size={19}
                    className={
                      wishlistCount > 0
                        ? "text-rose fill-rose"
                        : ""
                    }
                  />

                  {wishlistCount > 0 && (
                    <span
                      className="
                        absolute
                        top-0
                        right-0
                        min-w-[17px]
                        h-[17px]
                        px-1
                        rounded-full
                        bg-rose
                        text-white
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                  "
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={19} />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute
                        top-0
                        right-0
                        min-w-[17px]
                        h-[17px]
                        px-1
                        rounded-full
                        bg-amber-dark
                        text-white
                        text-[9px]
                        font-bold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous
                )
              }
              className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-ink-soft
                hover:bg-white
              "
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================
            MOBILE MENU
        ====================================================== */}

        {mobileMenuOpen && (
          <div
            className="
              xl:hidden
              border-t
              border-border
              py-5
              animate-fade-up
            "
          >
            <nav
              className="
                flex
                flex-col
                gap-1
              "
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm ${
                      isActive
                        ? "bg-white font-semibold text-ink"
                        : "text-ink-soft hover:bg-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      text-ink-soft
                      hover:bg-white
                      hover:text-ink
                    "
                  >
                    <span>🔔</span>
                    Notifications
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      text-ink-soft
                      hover:bg-white
                    "
                  >
                    <UserRound size={17} />
                    My Profile
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      mt-2
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-5
                      py-3
                      rounded-full
                      text-red-600
                      bg-red-50
                      text-sm
                      font-medium
                    "
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="
                      mt-2
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-5
                      py-3
                      rounded-full
                      bg-ink
                      text-cream
                      text-sm
                      font-medium
                    "
                  >
                    <LogIn size={16} />
                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-5
                      py-3
                      rounded-full
                      bg-forest
                      text-white
                      text-sm
                      font-medium
                    "
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </>
              )}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
