import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  BarChart2,
  Settings,
  CreditCard,
  Link2,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/scheduler", icon: Calendar, label: "Agendamento" },
  { to: "/dashboard/inbox", icon: Inbox, label: "Inbox" },
  { to: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/dashboard/social", icon: Link2, label: "Contas conectadas" },
];

const bottomItems = [
  { to: "/dashboard/billing", icon: CreditCard, label: "Plano & Billing" },
  { to: "/dashboard/settings", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-border transition-all duration-200 shrink-0",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-border", collapsed && "justify-center px-0")}>
        {!collapsed && (
          <span className="text-lg font-bold text-primary-600 tracking-tight">Vaiteia</span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-primary-600">V</span>
        )}
      </div>

      {/* Nav principal */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Nav inferior */}
      <div className="py-4 border-t border-border">
        <ul className="space-y-0.5 px-2">
          {bottomItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botão colapsar */}
        <div className="mt-2 px-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            <ChevronLeft
              size={16}
              className={cn("shrink-0 transition-transform", collapsed && "rotate-180")}
            />
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
