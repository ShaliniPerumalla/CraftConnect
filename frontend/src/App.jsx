import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

// ======================================================
// ROUTE PROTECTION
// ======================================================

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// ======================================================
// CONTEXT PROVIDERS
// ======================================================

import { CartProvider } from "./context/CartContext";
import { CraftsProvider } from "./context/CraftsContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrdersProvider } from "./context/OrdersContext";
import { NotificationProvider } from "./context/NotificationContext";
import { RequirementQuotationProvider } from "./context/RequirementQuotationContext";

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
import EmailVerification from "./pages/EmailVerification";

// ======================================================
// CUSTOMER / OTHER
// ======================================================

import Requirements from "./pages/Requirements";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import CustomerProfile from "./pages/CustomerProfile";
import Notifications from "./pages/Notifications";
import Chat from "./pages/chat";

// ======================================================
// ERROR
// ======================================================

import NotFound from "./pages/NotFound";

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
    <BrowserRouter>
      <NotificationProvider>
        <OrdersProvider>
          <WishlistProvider>
            <CartProvider>
              <CraftsProvider>
                <RequirementQuotationProvider>
                  <ScrollToTop />

                  <Routes>

                    {/* ==================================================
                        PUBLIC ROUTES
                    ================================================== */}

                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/creators" element={<Creators />} />
                    <Route path="/craft/:id" element={<CraftDetails />} />
                    <Route path="/creator/:id" element={<CreatorProfile />} />

                    {/* ==================================================
                        AUTH ROUTES
                    ================================================== */}

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<EmailVerification />} />

                    {/* ==================================================
                        AUTHENTICATED ROUTES
                    ================================================== */}

                    <Route element={<ProtectedRoute />}>

                      {/* -------------------------------
                          SHARED AUTHENTICATED (CUSTOMER & CREATOR)
                      ------------------------------- */}

                      <Route path="/requirements" element={<Requirements />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/profile" element={<CustomerProfile />} />
                      <Route path="/customer-profile" element={<CustomerProfile />} />

                      {/* ==================================================
                          CUSTOMER ONLY ROUTES
                      ================================================== */}

                      <Route element={<RoleRoute allowedRoles={["customer"]} />}>
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                      </Route>

                      {/* ==================================================
                          CREATOR ONLY ROUTES
                      ================================================== */}

                      <Route element={<RoleRoute allowedRoles={["creator"]} />}>
                        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
                        <Route path="/creator/add-craft" element={<AddCraft />} />
                        <Route path="/creator/crafts" element={<MyCrafts />} />
                        <Route path="/creator/edit-craft/:id" element={<EditCraft />} />
                        <Route path="/creator/orders" element={<CreatorOrders />} />
                      </Route>

                    </Route>

                    {/* ==================================================
                        404
                    ================================================== */}

                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </RequirementQuotationProvider>
              </CraftsProvider>
            </CartProvider>
          </WishlistProvider>
        </OrdersProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}