import { handleError, json, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const { data: apps, error: appsError } = await admin
      .from("applications")
      .select("payment_status, amount_inr, domain_id, created_at, deleted_at, domains(name)");
    if (appsError) throw appsError;
    const activeApps = (apps ?? []).filter((app) => !app.deleted_at);
    const { data: domains, error: domainsError } = await admin
      .from("domains")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true });
    if (domainsError) throw domainsError;

    const totals = {
      total: activeApps.length,
      paid: activeApps.filter((a) => a.payment_status === "paid").length,
      pending: activeApps.filter((a) => a.payment_status === "pending").length,
      failed: activeApps.filter((a) => a.payment_status === "failed").length,
      revenue:
        activeApps
          .filter((a) => a.payment_status === "paid")
          .reduce((s, a) => s + (a.amount_inr || 0), 0) ?? 0,
    };

    const byDomainMap = new Map();
    for (const domain of domains ?? []) {
      byDomainMap.set(domain.id, { id: domain.id, name: domain.name, count: 0, revenue: 0 });
    }

    for (const app of activeApps) {
      const name = app.domains?.name ?? "Unknown";
      const id = app.domain_id ?? name;
      const entry = byDomainMap.get(id) ?? { id, name, count: 0, revenue: 0 };
      entry.count += 1;
      if (app.payment_status === "paid") entry.revenue += app.amount_inr || 0;
      byDomainMap.set(id, entry);
    }

    json(res, 200, {
      totals,
      byDomain: Array.from(byDomainMap.values()),
      applications: activeApps,
    });
  } catch (error) {
    handleError(res, error);
  }
}
