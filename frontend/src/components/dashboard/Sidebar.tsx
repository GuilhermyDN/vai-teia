import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  BarChart2,
  Settings,
  CreditCard,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function VaiteiaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vt-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C97A" />
          <stop offset="100%" stopColor="#0F8A5A" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#vt-grad)" />
      <circle cx="10" cy="16" r="2.4" fill="white" />
      <circle cx="22" cy="10" r="2.4" fill="white" fillOpacity="0.9" />
      <circle cx="22" cy="22" r="2.4" fill="white" fillOpacity="0.9" />
      <line x1="12.1" y1="14.8" x2="19.9" y2="11.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
      <line x1="12.1" y1="17.2" x2="19.9" y2="20.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
    </svg>
  );
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/scheduler", icon: Calendar, label: "Agendamento" },
  { to: "/dashboard/inbox", icon: Inbox, label: "Inbox" },
  { to: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/dashboard/social", icon: Share2, label: "Contas sociais" },
];

const bottomItems = [
  { to: "/dashboard/billing", icon: CreditCard, label: "Plano & Billing" },
  { to: "/dashboard/settings", icon: Settings, label: "Configurações" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto",
          "flex flex-col bg-slate-950 border-r border-slate-800/50 shrink-0",
          "transition-all duration-300 ease-in-out",
          collapsed ? "lg:w-[68px]" : "lg:w-[240px]",
          mobileOpen ? "translate-x-0 w-[240px]" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-slate-800/50 shrink-0 gap-2.5",
            collapsed && "lg:justify-center lg:px-0 lg:gap-0"
          )}
        >
          <VaiteiaLogo size={32} />
          <span
            className={cn(
              "text-white font-bold text-[1.1rem] tracking-tight select-none transition-all duration-300 overflow-hidden whitespace-nowrap",
              collapsed ? "lg:w-0 lg:opacity-0 lg:ml-0" : "w-auto opacity-100"
            )}
          >
            vaiteia
          </span>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="ml-auto text-slate-500 hover:text-white lg:hidden p-1 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden scrollbar-none">
          <ul className="space-y-0.5 px-2">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-emerald-500/[0.12] text-emerald-400 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded-r before:bg-emerald-400"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
                      collapsed && "lg:justify-center lg:px-2"
                    )
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-300",
                      collapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {label}
                  </span>

                  {/* Tooltip collapsed */}
                  {collapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-slate-100 text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 hidden lg:block shadow-xl border border-slate-700/50">
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divisor */}
        <div className="mx-3 border-t border-slate-800/50" />

        {/* Nav inferior */}
        <div className="py-3">
          <ul className="space-y-0.5 px-2">
            {bottomItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-emerald-500/[0.12] text-emerald-400 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded-r before:bg-emerald-400"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
                      collapsed && "lg:justify-center lg:px-2"
                    )
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-300",
                      collapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {label}
                  </span>
                  {collapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-slate-100 text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 hidden lg:block shadow-xl border border-slate-700/50">
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Collapse button (desktop only) */}
          <div className="mt-1 px-2 hidden lg:block">
            <button
              onClick={onToggleCollapse}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-800/60 hover:text-slate-400 transition-all duration-150",
                collapsed && "justify-center"
              )}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? (
                <PanelLeftOpen size={15} className="shrink-0" />
              ) : (
                <>
                  <PanelLeftClose size={15} className="shrink-0" />
                  <span>Recolher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
