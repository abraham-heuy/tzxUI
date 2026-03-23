import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/landing";
import About from "./Pages/about";
import HowItWorks from "./Pages/howItWorks";
import PoolsPage from "./Pages/pools";
import Contact from "./Pages/contact";
import FAQs from "./Pages/FaQs";
import Register from "./Pages/register";
import Login from "./Pages/Login";
import { adminRoutes } from "./Pages/admin/adminRoutes";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/resetPassword";
import { userRoutes } from "./components/userComponents/UserRoutes";
import NewInvestment from "./components/userComponents/resuableComponents.tsx/NewInvestment";
import PublicRoute from "./components/adminComponents/publicRoutes";
import ProtectedRoute from "./components/adminComponents/protectedRoute";
import { ROLES } from "./config/roles";
import NotFound from "./Pages/NotFound";
import DerivViewer from "./components/userComponents/derivViewer";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pools" element={<PoolsPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/view-trading" element={<DerivViewer />} />

      {/* Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      {/* Protected Investment Route */}
      <Route path="investments/new" element={<NewInvestment />} />
      {/* Admin Routes - using env role */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        {adminRoutes}
      </Route>
      {/* User Routes - using env role */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.INVESTOR]}
            requireApproved={true}
          />
        }
      >
        {userRoutes}
      </Route>
      {/* 404 Redirect */}
      <Route path="*" element={<NotFound />} />{" "}
    </Routes>
  );
};
