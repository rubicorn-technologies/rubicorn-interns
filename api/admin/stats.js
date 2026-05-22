import { handleError, json, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const { data: apps } = await admin
      .from("applications")
      .select("payment_status, amount_inr, domain_id, domains(name)");

    const totals = {
      total: apps?.length ?? 0,
      paid: apps?.filter((a) => a.payment_status === "paid").length ?? 0,
      pending: apps?.filter((a) => a.payment_status === "pending").length ?? 0,
      failed: apps?.filter((a) => a.payment_status === "failed").length ?? 0,
      revenue:
        apps
          ?.filter((a) => a.payment_status === "paid")
          .reduce((s, a) => s + (a.amount_inr || 0), 0) ?? 0,
    };

    const byDomainMap = new Map();
    for (const app of apps ?? []) {
      const name = app.domains?.name ?? "Unknown";
      const entry = byDomainMap.get(name) ?? { name, count: 0, revenue: 0 };
      entry.count += 1;
      if (app.payment_status === "paid") entry.revenue += app.amount_inr || 0;
      byDomainMap.set(name, entry);
    }

    json(res, 200, { totals, byDomain: Array.from(byDomainMap.values()) });
  } catch (error) {
    handleError(res, error);
  }
}
