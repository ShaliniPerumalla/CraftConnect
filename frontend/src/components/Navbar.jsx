// src/components/Navbar.jsx

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
  LayoutDashboard,
  LogOut,
  Package,
} from "lucide-react";

import { useState, useEffect } from "react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import NotificationBell from "./notifications/NotificationBell";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { wishlistCount } = useWishlist();
  const { cartItems } = useCart();

  const cartCount =
    cartItems?.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    ) || 0;

  // Sync user state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("craftconnect_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }, []);

  const isCreator = user?.role === "creator";

  // BUYER NAVIGATION LINKS (Includes My Orders)
  const buyerNavItems = [
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
    {
      label: "Custom Order",
      path: "/requirements",
    },
    {
      label: "My Orders",
      path: "/orders",
    },
  ];

  // CREATOR NAVIGATION LINKS
  const creatorNavItems = [
    {
      label: "Dashboard",
      path: "/creator-dashboard",
    },
    {
      label: "My Crafts",
      path: "/creator/crafts",
    },
    {
      label: "Add Craft",
      path: "/creator/add-craft",
    },
    {
      label: "Incoming Orders",
      path: "/creator/orders",
    },
  ];

  const currentNavItems = isCreator ? creatorNavItems : buyerNavItems;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("craftconnect_user");
    setUser(null);
    closeMobileMenu();
    navigate("/login");
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
          {/* LOGO */}

          <Link
            to={isCreator ? "/creator-dashboard" : "/"}
            onClick={closeMobileMenu}
            className="
              font-display
              text-2xl
              sm:text-3xl
              text-ink
              shrink-0
              tracking-tight
              flex
              items-center
              gap-2
            "
          >
            Craft
            <span className="text-amber">
              Connect
            </span>
            {isCreator && (
              <span className="text-[10px] font-sans font-bold uppercase bg-forest text-white px-2 py-0.5 rounded-full tracking-wider">
                Creator
              </span>
            )}
          </Link>

          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              xl:flex
              items-center
              gap-5
            "
          >
            {currentNavItems.map((item) => (
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

          {/* DESKTOP ACTIONS */}

          <div
            className="
              hidden
              xl:flex
              items-center
              gap-2
              shrink-0
            "
          >
            <NotificationBell />

            {isCreator ? (
              /* CREATOR ACTIONS */
              <>
                <Link
                  to="/creator-dashboard"
                  className="
                    group
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                    hover:text-amber-dark
                    transition-all
                  "
                  aria-label="Creator Dashboard"
                  title="Creator Dashboard"
                >
                  <LayoutDashboard size={19} />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-full
                    border
                    border-border
                    text-ink-soft
                    hover:bg-white
                    hover:text-rose
                    text-sm
                    font-medium
                    transition-colors
                    ml-2
                  "
                  title="Logout"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              /* BUYER ACTIONS */
              <>
                {/* PROFILE */}

                <Link
                  to="/customer-profile"
                  className="
                    group
                    relative
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-ink-soft
                    hover:bg-white
                    hover:text-amber-dark
                    transition-all
                  "
                  aria-label="Customer profile"
                  title="My Profile"
                >
                  <UserRound
                    size={19}
                    strokeWidth={1.8}
                  />

                  {user && (
                    <span
                      className="
                        absolute
                        bottom-1
                        right-1
                        w-2
                        h-2
                        rounded-full
                        bg-forest
                        border-2
                        border-cream
                      "
                    />
                  )}
                </Link>

                {/* WISHLIST */}

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

                {/* CART */}

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

                {!user ? (
                  <>
                    {/* LOGIN */}

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

                    {/* REGISTER */}

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
                ) : (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-4
                      py-2
                      rounded-full
                      border
                      border-border
                      text-ink-soft
                      hover:bg-white
                      hover:text-rose
                      text-xs
                      font-medium
                      ml-2
                      transition-colors
                    "
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                )}
              </>
            )}
          </div>

          {/* MOBILE ACTIONS */}

          <div
            className="
              flex
              xl:hidden
              items-center
              gap-1
            "
          >
            <NotificationBell />

            {!isCreator && (
              <>
                {/* MOBILE PROFILE */}

                <Link
                  to="/customer-profile"
                  onClick={closeMobileMenu}
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
                  aria-label="Customer profile"
                >
                  <UserRound size={19} />
                </Link>

                {/* MOBILE WISHLIST */}

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
                      {wishlistCount > 99
                        ? "99+"
                        : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* MOBILE CART */}

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
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* MOBILE MENU BUTTON */}

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

        {/* MOBILE MENU */}

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
              {currentNavItems.map((item) => (
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

              {/* NOTIFICATIONS */}

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
                <BellIcon />
                Notifications
              </Link>

              {!isCreator && (
                <>
                  {/* ORDERS (MOBILE) */}

                  <Link
                    to="/orders"
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
                    <Package size={17} />
                    My Orders
                  </Link>

                  {/* PROFILE */}

                  <Link
                    to="/customer-profile"
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

                  {/* WISHLIST */}

                  <Link
                    to="/wishlist"
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
                    <Heart
                      size={17}
                      className={
                        wishlistCount > 0
                          ? "text-rose fill-rose"
                          : ""
                      }
                    />

                    Liked Crafts

                    {wishlistCount > 0 && (
                      <span className="ml-auto text-xs text-rose font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* CART */}

                  <Link
                    to="/cart"
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
                    <ShoppingBag size={17} />
                    Cart

                    {cartCount > 0 && (
                      <span className="ml-auto text-xs text-amber-dark font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-full
                    bg-rose/10
                    text-rose
                    text-sm
                    font-medium
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  {/* LOGIN */}

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

                  {/* REGISTER */}

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

function BellIcon() {
  return (
    <span className="text-base">
      🔔
    </span>
  );
}