import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { dashboardStats } from "@/lib/admin.functions";
import { CheckCircle2, Clock, IndianRupee, Users } from "lucide-react";
import { getAdminJson } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/")({
  component: Overview,
  head: () => ({
    meta: [{ title: "Admin Overview - Rubicorn" }, { name: "robots", content: "noindex" }],
  }),
});

function Overview() {
  const fn = useServerFn(dashboardStats);
  const [domainId, setDomainId] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: async () =>
      (await getAdminJson<Awaited<ReturnType<typeof fn>>>("/api/admin/stats")) ?? fn(),
  });

  const filteredApps = useMemo(() => {
    const start = from ? new Date(`${from}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
    const end = to ? new Date(`${to}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;
    return (data?.applications ?? []).filter((app) => {
      const created = new Date(app.created_at).getTime();
      return (
        (domainId === "all" || app.domain_id === domainId) && created >= start && created <= end
      );
    });
  }, [data?.applications, domainId, from, to]);

  const filteredDomainStats = useMemo(() => {
    const domainMap = new Map(
      (data?.byDomain ?? []).map((domain) => [
        domain.id,
        { id: domain.id, name: domain.name, count: 0, revenue: 0 },
      ]),
    );
    for (const app of filteredApps) {
      const domain = domainMap.get(app.domain_id);
      if (!domain) continue;
      domain.count += 1;
      if (app.payment_status === "paid") domain.revenue += app.amount_inr || 0;
    }
    const domains = Array.from(domainMap.values());
    return domainId === "all" ? domains : domains.filter((domain) => domain.id === domainId);
  }, [data?.byDomain, domainId, filteredApps]);

  const totals = {
    total: filteredApps.length,
    paid: filteredApps.filter((app) => app.payment_status === "paid").length,
    pending: filteredApps.filter((app) => app.payment_status === "pending").length,
    revenue: filteredApps
      .filter((app) => app.payment_status === "paid")
      .reduce((sum, app) => sum + (app.amount_inr || 0), 0),
  };
  const cards = [
    { label: "Total Applicants", value: totals.total, icon: Users },
    { label: "Paid", value: totals.paid, icon: CheckCircle2 },
    { label: "Pending", value: totals.pending, icon: Clock },
    { label: "Revenue", value: `INR ${totals.revenue}`, icon: IndianRupee },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Program metrics by application timestamp.
          </p>
        </div>
        <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[190px_150px_150px]">
          <Select value={domainId} onValueChange={setDomainId}>
            <SelectTrigger className="border-white/10 bg-white/5">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              {(data?.byDomain ?? []).map((domain) => (
                <SelectItem key={domain.id} value={domain.id}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="border-white/10 bg-white/5"
            aria-label="From date"
          />
          <Input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="border-white/10 bg-white/5"
            aria-label="To date"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass mt-8 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">Revenue by Domain</h2>
        <div className="mt-4 space-y-3">
          {filteredDomainStats.map((domain) => (
            <div
              key={domain.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              <span>{domain.name}</span>
              <span className="flex gap-4 text-muted-foreground">
                <span>{domain.count} applicants</span>
                <span className="font-semibold text-foreground">INR {domain.revenue}</span>
              </span>
            </div>
          ))}
          {!filteredDomainStats.length && (
            <p className="text-sm text-muted-foreground">No domains yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
