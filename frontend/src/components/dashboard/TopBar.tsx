import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/scheduler": "Agendamento",
  "/dashboard/inbox": "Inbox",
  "/dashboard/analytics": "Analytics",
  "/dashboard/social": "Contas sociais",
  "/dashboard/billing": "Plano & Billing",
  "/dashboard/settings": "Configurações",
};

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-[0.9375rem] font-semibold text-slate-800">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell size={17} />
        </button>

        {/* Avatar + dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 pr-2.5 hover:bg-slate-100 transition-colors outline-none group">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.name} />
                <AvatarFallback className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-700">
                  {getInitials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-[0.8125rem] font-medium text-slate-700 hidden sm:block leading-none">
                {user?.name?.split(" ")[0]}
              </span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[200px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/80 p-1.5 text-sm animate-in fade-in-0 zoom-in-95"
            >
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="font-semibold text-slate-800 truncate text-[0.8125rem]">{user?.name}</p>
                <p className="text-[0.75rem] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <DropdownMenu.Item asChild>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer outline-none text-slate-600 hover:text-slate-800 transition-colors text-[0.8125rem]"
                >
                  Configurações
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  to="/dashboard/billing"
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer outline-none text-slate-600 hover:text-slate-800 transition-colors text-[0.8125rem]"
                >
                  Plano & Billing
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 border-t border-slate-100" />
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 cursor-pointer outline-none transition-colors text-[0.8125rem]"
                onSelect={logout}
              >
                Sair da conta
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
