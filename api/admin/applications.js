import { handleError, json, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const { data, error } = await admin
      .from("applications")
      .select("*, domains(name, slug)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const { data: domains, error: domainsError } = await admin
      .from("domains")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true });
    if (domainsError) throw domainsError;

    json(res, 200, { applications: data ?? [], domains: domains ?? [] });
  } catch (error) {
    handleError(res, error);
  }
}
