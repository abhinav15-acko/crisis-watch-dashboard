import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Monitor, MessageSquareWarning, Activity, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
interface DashboardLayoutProps {
  children: ReactNode;
}
const navItems = [{
  title: "Tech Breakdown Insights",
  href: "/tech",
  icon: Monitor,
  description: "Tech monitoring"
}, {
  title: "Customer Experience Insights",
  href: "/support-tickets",
  icon: MessageSquareWarning,
  description: "Ticket analysis"
}, {
  title: "Competitor Insights",
  href: "/brand-comparison",
  icon: GitCompare,
  description: "Compare brands"
}];
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  return <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn("fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300", collapsed ? "w-16" : "w-64")}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            {!collapsed && <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-heading font-semibold text-lg">Hassle Insights Engine</span>
              </div>}
            {collapsed && <Activity className="h-6 w-6 text-primary mx-auto" />}
            <Button variant="ghost" size="icon" className={cn("h-8 w-8", collapsed && "mx-auto")} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map(item => <NavLink key={item.href} to={item.href} className={({
            isActive
          }) => cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70")}>
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>)}
          </nav>

          {/* Status indicator */}
          <div className={cn("border-t border-sidebar-border p-4", collapsed && "p-2")}>
            <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
              </span>
              {!collapsed && <span className="text-xs text-muted-foreground">System Online</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        <div className="p-6">{children}</div>
      </main>
    </div>;
}