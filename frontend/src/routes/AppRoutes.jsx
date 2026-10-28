import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";
import Requirements from "../pages/Requirements";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Chat from "../pages/chat";
import CustomerProfile from "../pages/CustomerProfile";
import Notifications from "../pages/Notifications";
import CreatorDashboard from "../pages/CreatorDashboard";
import AddCraft from "../pages/AddCraft";
import MyCrafts from "../pages/MyCrafts";
import EditCraft from "../pages/EditCraft";
import CreatorOrders from "../pages/CreatorOrders";
import AdminDashboard from "../pages/AdminDashboard";
import AdminComplaints from "../pages/AdminComplaints";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/verify-email/:token"
        element={<EmailVerification />}
      />


      {/* ================= AUTHENTICATED ================= */}

      <Route element={<ProtectedRoute />}>

        {/* Customer + Creator */}
        <Route
          path="/requirements"
          element={<Requirements />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        <Route
          path="/profile"
          element={<CustomerProfile />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Route>


      {/* ================= CUSTOMER ================= */}

      <Route element={<RoleRoute allowedRoles={["customer"]} />}>

        <Route
          path="/requirements"
          element={<Requirements />}
        />

      </Route>


      {/* ================= CREATOR ================= */}

      <Route element={<RoleRoute allowedRoles={["creator"]} />}>

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

      </Route>


      {/* ================= ADMIN ================= */}

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/complaints"
          element={<AdminComplaints />}
        />

      </Route>


      {/* ================= 404 ================= */}

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}