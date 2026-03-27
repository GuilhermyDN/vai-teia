import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell size={18} />
        </button>

        {/* Avatar + dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent transition-colors outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.name} />
                <AvatarFallback className="text-xs">{getInitials(user?.name ?? "U")}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{user?.name?.split(" ")[0]}</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[180px] bg-white rounded-lg shadow-md border border-border p-1 text-sm"
            >
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenu.Item asChild>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-accent cursor-pointer outline-none"
                >
                  Configurações
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  to="/dashboard/billing"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-accent cursor-pointer outline-none"
                >
                  Plano & Billing
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 border-t border-border" />
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 rounded-md hover:bg-red-50 text-red-600 cursor-pointer outline-none"
                onSelect={logout}
              >
                Sair
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
