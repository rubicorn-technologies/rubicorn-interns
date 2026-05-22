import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/lib/admin.functions";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, Users, CreditCard, FileBadge, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminJson } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    try {
      const res =
        (await getAdminJson<{ isAdmin: boolean }>("/api/admin/check")) ?? (await checkAdmin());
      if (!res.isAdmin) throw redirect({ to: "/login" });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const nav = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/applicants", label: "Applicants", icon: Users },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/certificates", label: "Certificates", icon: FileBadge },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];
  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="glass-strong sticky top-0 hidden h-screen flex-col border-r border-white/10 p-5 md:flex">
        <Logo />
        <nav className="mt-8 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.end }}
              activeProps={{ className: "bg-white/10 text-foreground" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="p-5 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
