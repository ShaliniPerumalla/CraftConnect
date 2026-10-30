import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";
import NotFound from "../pages/NotFound";

// Import your existing pages here

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
          element={<Profile />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Route>


      {/* ================= CUSTOMER ================= */}

      <Route element={<RoleRoute allowedRoles={["customer"]} />}>

        {/* customer-specific routes */}

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