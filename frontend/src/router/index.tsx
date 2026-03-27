import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import SchedulerPage from "@/pages/dashboard/SchedulerPage";
import InboxPage from "@/pages/dashboard/InboxPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import SocialPage from "@/pages/dashboard/SocialPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

export const router = createBrowserRouter([
  // ── Auth ──────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
      { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/auth/reset-password", element: <ResetPasswordPage /> },
      { path: "/auth/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  // ── Dashboard ─────────────────────────────────────────
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/dashboard/scheduler", element: <SchedulerPage /> },
      { path: "/dashboard/inbox", element: <InboxPage /> },
      { path: "/dashboard/analytics", element: <AnalyticsPage /> },
      { path: "/dashboard/social", element: <SocialPage /> },
      { path: "/dashboard/billing", element: <BillingPage /> },
      { path: "/dashboard/settings", element: <SettingsPage /> },
    ],
  },

  // ── Páginas públicas ──────────────────────────────────
  { path: "/terms", element: <TermsPage /> },
  { path: "/privacy", element: <PrivacyPage /> },

  // ── Redirect raiz ─────────────────────────────────────
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <LoginPage /> },
]);
