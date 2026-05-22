import { handleError, json, readJson, requireAdmin } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const { admin } = await requireAdmin(req);
    const body = await readJson(req);
    if (!body.id) return json(res, 400, { error: "Missing application id" });

    const { data, error } = await admin
      .from("applications")
      .update({ deleted_at: null, deleted_by: null })
      .eq("id", body.id)
      .select("id, deleted_at")
      .single();

    if (error) throw error;
    json(res, 200, { application: data });
  } catch (error) {
    handleError(res, error);
  }
}
