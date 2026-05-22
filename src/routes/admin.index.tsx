import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { dashboardStats } from "@/lib/admin.functions";
import { Users, IndianRupee, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
  head: () => ({ meta: [{ title: "Admin Overview — Rubicorn" }, { name: "robots", content: "noindex" }] }),
});

function Overview() {
  const fn = useServerFn(dashboardStats);
  const { data } = useQuery({ queryKey: ["stats"], queryFn: () => fn() });
  const t = data?.totals;
  const cards = [
    { label: "Total Applicants", value: t?.total ?? 0, icon: Users },
    { label: "Paid", value: t?.paid ?? 0, icon: CheckCircle2 },
    { label: "Pending", value: t?.pending ?? 0, icon: Clock },
    { label: "Revenue", value: `₹${t?.revenue ?? 0}`, icon: IndianRupee },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">All-time program metrics.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-8 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Revenue by Domain</h2>
        <div className="mt-4 space-y-3">
          {data?.byDomain.map((d) => (
            <div key={d.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span>{d.name}</span>
              <span className="flex gap-4 text-muted-foreground">
                <span>{d.count} applicants</span>
                <span className="font-semibold text-foreground">₹{d.revenue}</span>
              </span>
            </div>
          ))}
          {!data?.byDomain.length && <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
