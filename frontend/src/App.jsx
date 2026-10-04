import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

// ======================================================
// CONTEXT PROVIDERS
// ======================================================

import { CartProvider } from "./context/CartContext";
import { CraftsProvider } from "./context/CraftsContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrdersProvider } from "./context/OrdersContext";
import { NotificationProvider } from "./context/NotificationContext";
import { RequirementQuotationProvider } from "./context/RequirementQuotationContext";
import { RequirementsProvider } from "./context/RequirementsContext";
import { ReviewProvider } from "./context/ReviewContext";
import { ComplaintProvider } from "./context/ComplaintContext";

// ======================================================
// MAIN PAGES
// ======================================================

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import Creators from "./pages/Creators";

// ======================================================
// CRAFT
// ======================================================

import CraftDetails from "./pages/CraftDetails";
import Wishlist from "./pages/Wishlist";

// ======================================================
// CREATOR
// ======================================================

import CreatorProfile from "./pages/CreatorProfile";
import CreatorDashboard from "./pages/CreatorDashboard";
import AddCraft from "./pages/AddCraft";
import MyCrafts from "./pages/MyCrafts";
import EditCraft from "./pages/EditCraft";
import CreatorOrders from "./pages/CreatorOrders";

// ======================================================
// CART / CHECKOUT
// ======================================================

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// ======================================================
// AUTH
// ======================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ======================================================
// OTHER
// ======================================================

import Requirements from "./pages/Requirements";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import CustomerProfile from "./pages/CustomerProfile";
import Notifications from "./pages/Notifications";
import Chat from "./pages/chat";
import Complaints from "./pages/Complaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";

// ======================================================
// SCROLL TO TOP
// ======================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <ReviewProvider>
      <BrowserRouter>
        <NotificationProvider>
          <OrdersProvider>
            <WishlistProvider>
              <CartProvider>
                <CraftsProvider>
                  <RequirementQuotationProvider>
                    <ComplaintProvider>
                      <RequirementsProvider>

                        <ScrollToTop />

                        <Routes>

                          {/* ================= MAIN ================= */}

                          <Route path="/" element={<Home />} />
                          <Route path="/explore" element={<Explore />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/creators" element={<Creators />} />

                          {/* ================= CRAFT ================= */}

                          <Route
                            path="/craft/:id"
                            element={<CraftDetails />}
                          />

                          <Route
                            path="/wishlist"
                            element={<Wishlist />}
                          />

                          {/* ================= CREATOR ================= */}

                          <Route
                            path="/creator/:id"
                            element={<CreatorProfile />}
                          />

                          <Route
                            path="/creator-dashboard"
                            element={<CreatorDashboard />}
                          />

                          <Route
                            path="/creator/add-craft"
                            element={<AddCraft />}
                          />

                          <Route
                            path="/creator/crafts"
                            element={<MyCrafts />}
                          />

                          <Route
                            path="/creator/edit-craft/:id"
                            element={<EditCraft />}
                          />

                          <Route
                            path="/creator/orders"
                            element={<CreatorOrders />}
                          />

                          {/* ================= CART / CHECKOUT ================= */}

                          <Route
                            path="/cart"
                            element={<Cart />}
                          />

                          <Route
                            path="/checkout"
                            element={<Checkout />}
                          />

                          <Route
                            path="/order-success"
                            element={<OrderSuccess />}
                          />

                          {/* ================= AUTH ================= */}

                          <Route
                            path="/login"
                            element={<Login />}
                          />

                          <Route
                            path="/register"
                            element={<Register />}
                          />

                          <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                          />

                          <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                          />

                          {/* ================= REQUIREMENTS ================= */}

                          <Route
                            path="/requirements"
                            element={<Requirements />}
                          />

                          {/* ================= ORDERS ================= */}

                          <Route
                            path="/orders"
                            element={<Orders />}
                          />

                          <Route
                            path="/orders/:id"
                            element={<OrderDetails />}
                          />

                          {/* ================= CHAT ================= */}

                          <Route
                            path="/chat"
                            element={<Chat />}
                          />

                          {/* ================= PROFILE ================= */}

                          <Route
                            path="/profile"
                            element={<CustomerProfile />}
                          />

                          <Route
                            path="/customer-profile"
                            element={<CustomerProfile />}
                          />

                          {/* ================= NOTIFICATIONS ================= */}

                          <Route
                            path="/notifications"
                            element={<Notifications />}
                          />

                          {/* ================= COMPLAINTS ================= */}

                          <Route
                            path="/complaints"
                            element={<Complaints />}
                          />

                          {/* ================= ADMIN ================= */}

                          <Route
                            path="/admin"
                            element={<AdminDashboard />}
                          />

                          <Route
                            path="/admin/complaints"
                            element={<AdminComplaints />}
                          />

                        </Routes>

                      </RequirementsProvider>
                    </ComplaintProvider>
                  </RequirementQuotationProvider>
                </CraftsProvider>
              </CartProvider>
            </WishlistProvider>
          </OrdersProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ReviewProvider>
  );
}