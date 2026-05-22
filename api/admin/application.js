import { handleError, json, readJson, requireAdmin } from "../_utils.js";

const modes = new Set(["online", "hybrid", "offline"]);
const statuses = new Set(["pending", "paid", "failed"]);

function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export default async function handler(req, res) {
  if (req.method !== "PATCH") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const body = await readJson(req);

    if (!body.id) return json(res, 400, { error: "Missing application id" });
    if (!modes.has(body.mode)) return json(res, 400, { error: "Invalid internship mode" });
    if (!statuses.has(body.payment_status)) {
      return json(res, 400, { error: "Invalid payment status" });
    }

    const changes = {
      full_name: text(body.full_name),
      email: text(body.email),
      phone: text(body.phone),
      college: text(body.college),
      degree: text(body.degree),
      year_of_study: text(body.year_of_study),
      domain_id: body.domain_id,
      mode: body.mode,
      payment_status: body.payment_status,
      amount_inr: Number(body.amount_inr) || 0,
      intern_id: text(body.intern_id),
      linkedin_url: text(body.linkedin_url),
      github_url: text(body.github_url),
      motivation: text(body.motivation),
    };

    for (const [key, value] of Object.entries(changes)) {
      if (["intern_id", "linkedin_url", "github_url", "motivation"].includes(key)) continue;
      if (value === null || value === undefined || value === "") {
        return json(res, 400, { error: `Missing ${key}` });
      }
    }

    const { data, error } = await admin
      .from("applications")
      .update(changes)
      .eq("id", body.id)
      .select("*, domains(name, slug)")
      .single();

    if (error) throw error;
    json(res, 200, { application: data });
  } catch (error) {
    handleError(res, error);
  }
}
