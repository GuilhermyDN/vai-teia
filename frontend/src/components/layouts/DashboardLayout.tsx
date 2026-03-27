import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useMe } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isLoading } = useMe();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
